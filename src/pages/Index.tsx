/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { StepIndicator } from "@/components/ui/step-indicator";
import { PDFUpload } from "@/components/zoning/pdf-upload";
import { Georeferencing } from "@/components/zoning/georeferencing";
import { ZoningTypes, type ZoningType } from "@/components/zoning/zoning-types";
import { DrawingTools } from "@/components/zoning/drawing-tools";
import { ExportTools } from "@/components/zoning/export-tools";
import { OverlayControls } from "@/components/zoning/overlay-controls";
import { AISetup } from "@/components/zoning/ai-setup";
import { initializeOpenAI, calculateAlignment } from "@/services/ai-vision";
import { defaultZoningTypes } from "@/data/zoning-types";

const Index = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState("upload");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfImageData, setPdfImageData] = useState<string | null>(null);
  const [zoningTypes, setZoningTypes] = useState<ZoningType[]>(defaultZoningTypes);
  const [selectedZoneType, setSelectedZoneType] = useState<ZoningType | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [featureCount, setFeatureCount] = useState(0);
  const [map, setMap] = useState<any>(null);
  const [overlayLayer, setOverlayLayer] = useState<any>(null);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayReady, setOverlayReady] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(false);

  const steps = [
    {
      id: "upload",
      title: "Upload PDF",
      description: "Upload your zoning map PDF file"
    },
    {
      id: "georeference",
      title: "Georeference",
      description: "Set map coordinates and overlay"
    },
    {
      id: "zones",
      title: "Zone Types",
      description: "Configure zoning classifications"
    },
    {
      id: "draw",
      title: "Draw Zones",
      description: "Digitize zone boundaries"
    },
    {
      id: "export",
      title: "Export Data",
      description: "Download GeoJSON or KML files"
    }
  ];

  // Initialize AI and OpenLayers map
  useEffect(() => {
    // Check for stored API key on mount
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      initializeOpenAI(storedApiKey);
      setIsAIEnabled(true);
    }

    const initMap = async () => {
      try {
        // Check if OpenLayers is available
        if (!(window as any).ol) {
          throw new Error("OpenLayers library not loaded");
        }

        const ol = (window as any).ol;
        
        const newMap = new ol.Map({
          target: mapRef.current,
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
          ],
          view: new ol.View({
            center: ol.proj.fromLonLat([-87.3700, 44.8400]), // Sturgeon Bay center
            zoom: 13
          }),
          controls: ol.control.defaults.defaults().extend([
            new ol.control.ScaleLine(),
            new ol.control.MousePosition({
              coordinateFormat: ol.coordinate.createStringXY(4),
              projection: 'EPSG:4326',
              className: 'custom-mouse-position',
              target: document.getElementById('mouse-position'),
            })
          ])
        });

        setMap(newMap);
        toast.success("Map initialized successfully!");
      } catch (error) {
        console.error("Failed to initialize map:", error);
        toast.error("Failed to load map. Please refresh the page.");
      }
    };

    // Add a small delay to ensure DOM is ready
    setTimeout(initMap, 100);
  }, []);

  const handlePDFUploaded = (file: File, imageData: string) => {
    setUploadedFile(file);
    setPdfImageData(imageData);
    setCompletedSteps(prev => [...prev, "upload"]);
    setCurrentStep("georeference");
  };

  const handleGeoreference = (bounds: [number, number, number, number]) => {
    if (!map || !pdfImageData) return;

    const ol = (window as any).ol;
    
    // Remove existing overlay if present
    if (overlayLayer) {
      map.removeLayer(overlayLayer);
    }

    const newOverlay = new ol.layer.Image({
      source: new ol.source.ImageStatic({
        url: pdfImageData,
        imageExtent: ol.proj.transformExtent(bounds, 'EPSG:4326', 'EPSG:3857'),
      }),
      opacity: 0.7,
      name: 'pdf-overlay'
    });

    map.addLayer(newOverlay);
    setOverlayLayer(newOverlay);
    setOverlayVisible(true);
    setOverlayReady(true);

    // Store original bounds for reset
    map.set('originalBounds', bounds);
    map.set('currentScale', 1);
    map.set('currentOpacity', 0.7);
    map.set('currentRotation', 0);
    map.set('positionOffset', { x: 0, y: 0 });

    // Fit view to overlay extent
    const extent = ol.proj.transformExtent(bounds, 'EPSG:4326', 'EPSG:3857');
    map.getView().fit(extent, { padding: [20, 20, 20, 20] });

    setCompletedSteps(prev => [...prev, "georeference"]);
    setCurrentStep("zones");
  };

  const handleOverlayScaleChange = (scale: number) => {
    if (!map || !overlayLayer) return;

    const ol = (window as any).ol;
    const originalBounds = map.get('originalBounds');
    const positionOffset = map.get('positionOffset') || { x: 0, y: 0 };
    
    if (originalBounds) {
      // Calculate center point
      const centerX = (originalBounds[0] + originalBounds[2]) / 2;
      const centerY = (originalBounds[1] + originalBounds[3]) / 2;
      
      // Calculate scaled bounds around center
      const width = (originalBounds[2] - originalBounds[0]) * scale;
      const height = (originalBounds[3] - originalBounds[1]) * scale;
      
      const newBounds = [
        centerX - width/2 + positionOffset.x,
        centerY - height/2 + positionOffset.y,
        centerX + width/2 + positionOffset.x,
        centerY + height/2 + positionOffset.y
      ];

      const imageExtent = ol.proj.transformExtent(newBounds, 'EPSG:4326', 'EPSG:3857');
      overlayLayer.getSource().setImageExtent(imageExtent);
      map.set('currentScale', scale);
    }
  };

  const handleOverlayOpacityChange = (opacity: number) => {
    if (!overlayLayer) return;
    overlayLayer.setOpacity(opacity);
    map?.set('currentOpacity', opacity);
  };

  const handleOverlayPositionChange = (deltaX: number, deltaY: number) => {
    if (!map || !overlayLayer) return;

    const ol = (window as any).ol;
    const originalBounds = map.get('originalBounds');
    const currentScale = map.get('currentScale') || 1;
    const currentOffset = map.get('positionOffset') || { x: 0, y: 0 };
    
    if (originalBounds) {
      const newOffset = {
        x: currentOffset.x + deltaX,
        y: currentOffset.y + deltaY
      };

      const centerX = (originalBounds[0] + originalBounds[2]) / 2;
      const centerY = (originalBounds[1] + originalBounds[3]) / 2;
      const width = (originalBounds[2] - originalBounds[0]) * currentScale;
      const height = (originalBounds[3] - originalBounds[1]) * currentScale;
      
      const newBounds = [
        centerX - width/2 + newOffset.x,
        centerY - height/2 + newOffset.y,
        centerX + width/2 + newOffset.x,
        centerY + height/2 + newOffset.y
      ];

      const imageExtent = ol.proj.transformExtent(newBounds, 'EPSG:4326', 'EPSG:3857');
      overlayLayer.getSource().setImageExtent(imageExtent);
      map.set('positionOffset', newOffset);
    }
  };

  const handleOverlayRotationChange = (rotation: number) => {
    // Note: OpenLayers Image layers don't support rotation directly
    // This would require more complex implementation with canvas manipulation
    // For now, we'll store the rotation value for potential future use
    map?.set('currentRotation', rotation);
    toast.info("Rotation feature coming soon - use position and scale for now");
  };

  const handleToggleOverlay = () => {
    if (!overlayLayer) {
      toast.error("No overlay to toggle");
      return;
    }
    const newVisible = !overlayLayer.getVisible();
    overlayLayer.setVisible(newVisible);
    setOverlayVisible(newVisible);
    toast.info(newVisible ? "Overlay shown" : "Overlay hidden");
  };

  const handleAIEnabledChange = () => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    setIsAIEnabled(!!storedApiKey);
  };

  const captureMapScreenshot = (): Promise<string> => {
    return new Promise((resolve) => {
      if (!map) {
        resolve('');
        return;
      }

      map.once('rendercomplete', () => {
        const mapCanvas = document.querySelector('.ol-viewport canvas') as HTMLCanvasElement;
        if (mapCanvas) {
          resolve(mapCanvas.toDataURL());
        } else {
          resolve('');
        }
      });
      map.renderSync();
    });
  };

  const handleAutoAlign = async () => {
    if (!pdfImageData || !map) return;

    // Capture current map view
    const mapScreenshot = await captureMapScreenshot();
    if (!mapScreenshot) {
      throw new Error('Failed to capture map screenshot');
    }

    // Get AI alignment suggestion
    const suggestion = await calculateAlignment(pdfImageData, mapScreenshot);
    if (suggestion && overlayLayer) {
      // Apply the suggested transformations
      console.log('AI alignment suggestion:', suggestion);
      handleOverlayScaleChange(suggestion.scale);
      // Position and rotation would need more complex implementation
    }
  };

  const handleStartDrawing = () => {
    if (!map || !selectedZoneType) return;

    const ol = (window as any).ol;
    
    // Create vector source and layer for drawings
    let vectorSource = map.get('drawingSource');
    if (!vectorSource) {
      vectorSource = new ol.source.Vector();
      const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: (feature: any) => {
          const zoneType = feature.get('zoneType');
          return new ol.style.Style({
            fill: new ol.style.Fill({
              color: zoneType?.color + '40' || '#2196f340'
            }),
            stroke: new ol.style.Stroke({
              color: zoneType?.color || '#2196f3',
              width: 2
            })
          });
        }
      });
      map.addLayer(vectorLayer);
      map.set('drawingSource', vectorSource);
    }

    // Create draw interaction
    const drawInteraction = new ol.interaction.Draw({
      source: vectorSource,
      type: 'Polygon'
    });

    drawInteraction.on('drawend', (event: any) => {
      const feature = event.feature;
      feature.setProperties({
        zoneType: selectedZoneType,
        zoneName: selectedZoneType.name,
        zoneCode: selectedZoneType.code,
        timestamp: new Date().toISOString()
      });
      
      setFeatureCount(prev => prev + 1);
      toast.success(`Zone ${selectedZoneType.code} added`);
    });

    map.addInteraction(drawInteraction);
    map.set('drawInteraction', drawInteraction);
    
    setIsDrawing(true);
  };

  const handleStopDrawing = () => {
    if (!map) return;

    const drawInteraction = map.get('drawInteraction');
    if (drawInteraction) {
      map.removeInteraction(drawInteraction);
      map.unset('drawInteraction');
    }
    
    setIsDrawing(false);
  };

  const handleClearAll = () => {
    if (!map) return;

    const vectorSource = map.get('drawingSource');
    if (vectorSource) {
      vectorSource.clear();
      setFeatureCount(0);
    }
  };

  const handleExportGeoJSON = () => {
    if (!map) return;

    const ol = (window as any).ol;
    const vectorSource = map.get('drawingSource');
    if (!vectorSource) return;

    const features = vectorSource.getFeatures();
    const geoJSONFormat = new ol.format.GeoJSON();
    
    const geoJSON = {
      type: "FeatureCollection",
      metadata: {
        title: "Zoning Map",
        created: new Date().toISOString(),
        source: uploadedFile?.name || "Unknown",
        totalZones: features.length
      },
      features: features.map((feature: any) => {
        const geom = feature.getGeometry().clone();
        geom.transform('EPSG:3857', 'EPSG:4326');
        
        return {
          type: "Feature",
          geometry: geoJSONFormat.writeGeometryObject(geom),
          properties: {
            zoneType: feature.get('zoneCode'),
            zoneName: feature.get('zoneName'),
            timestamp: feature.get('timestamp')
          }
        };
      })
    };

    const dataStr = JSON.stringify(geoJSON, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'zoning-map.geojson';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleExportKML = () => {
    if (!map) return;

    const ol = (window as any).ol;
    const vectorSource = map.get('drawingSource');
    if (!vectorSource) return;

    const features = vectorSource.getFeatures();
    const kmlFormat = new ol.format.KML();
    
    // Transform features to EPSG:4326 for KML
    const transformedFeatures = features.map((feature: any) => {
      const clone = feature.clone();
      clone.getGeometry().transform('EPSG:3857', 'EPSG:4326');
      return clone;
    });

    const kml = kmlFormat.writeFeatures(transformedFeatures);
    const dataBlob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'zoning-map.kml';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-96 bg-gradient-sidebar border-r border-sidebar-border shadow-sidebar overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold bg-gradient-header bg-clip-text text-transparent">
                Zoning Map Digitizer
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Convert PDF zoning maps to interactive vector data
              </p>
            </div>

            {/* Step Indicator */}
            <div className="mb-8">
              <StepIndicator 
                steps={steps} 
                currentStep={currentStep} 
                completedSteps={completedSteps} 
              />
            </div>

            {/* AI Setup */}
            <AISetup 
              onAIEnabled={handleAIEnabledChange}
              isAIEnabled={isAIEnabled}
            />

            {/* Step Content */}
            <div className="space-y-6">
              {currentStep === "upload" && (
                <PDFUpload onPDFUploaded={handlePDFUploaded} />
              )}

              {currentStep === "georeference" && (
                <div className="space-y-4">
                  <Georeferencing
                    onGeoreference={handleGeoreference}
                    disabled={!pdfImageData}
                    overlayVisible={overlayVisible}
                    onToggleOverlay={handleToggleOverlay}
                    overlayReady={overlayReady}
                    isAIEnabled={isAIEnabled}
                    pdfImageUrl={pdfImageData || undefined}
                  />
                  
                  {overlayReady && (
                    <OverlayControls
                      onScaleChange={handleOverlayScaleChange}
                      onOpacityChange={handleOverlayOpacityChange}
                      onPositionChange={handleOverlayPositionChange}
                      onRotationChange={handleOverlayRotationChange}
                      overlayVisible={overlayVisible}
                      onToggleOverlay={handleToggleOverlay}
                      overlayReady={overlayReady}
                      isAIEnabled={isAIEnabled}
                      pdfImageUrl={pdfImageData || undefined}
                      onAutoAlign={handleAutoAlign}
                    />
                  )}
                </div>
              )}

              {(currentStep === "zones" || completedSteps.includes("zones")) && (
                <ZoningTypes
                  zoningTypes={zoningTypes}
                  onUpdateZoningTypes={setZoningTypes}
                  selectedType={selectedZoneType}
                  onSelectType={(type) => {
                    setSelectedZoneType(type);
                    if (!completedSteps.includes("zones")) {
                      setCompletedSteps(prev => [...prev, "zones"]);
                      setCurrentStep("draw");
                    }
                  }}
                />
              )}

              {(currentStep === "draw" || completedSteps.includes("draw")) && (
                <DrawingTools
                  selectedZoneType={selectedZoneType}
                  isDrawing={isDrawing}
                  onStartDrawing={handleStartDrawing}
                  onStopDrawing={handleStopDrawing}
                  onClearAll={handleClearAll}
                  featureCount={featureCount}
                />
              )}

              {(currentStep === "export" || featureCount > 0) && (
                <ExportTools
                  onExportGeoJSON={handleExportGeoJSON}
                  onExportKML={handleExportKML}
                  featureCount={featureCount}
                />
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-card border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold">Interactive Map</h2>
              {uploadedFile && (
                <span className="text-sm text-muted-foreground">
                  {uploadedFile.name}
                </span>
              )}
            </div>
            <div id="mouse-position" className="text-sm text-muted-foreground"></div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            <div
              ref={mapRef}
              className="w-full h-full bg-map-bg shadow-map"
            />
            
            {!map && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading map...</p>
                </div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="bg-card border-t border-border p-2 flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Step: {steps.find(s => s.id === currentStep)?.title}
              </span>
              {featureCount > 0 && (
                <span className="text-muted-foreground">
                  Zones: {featureCount}
                </span>
              )}
            </div>
            <div className="text-muted-foreground">
              Sturgeon Bay, WI Zoning Digitizer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;