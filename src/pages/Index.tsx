import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { StepIndicator } from "@/components/ui/step-indicator";
import { PDFUpload } from "@/components/zoning/pdf-upload";
import { Georeferencing } from "@/components/zoning/georeferencing";
import { ZoningTypes, type ZoningType } from "@/components/zoning/zoning-types";
import { DrawingTools } from "@/components/zoning/drawing-tools";
import { ExportTools } from "@/components/zoning/export-tools";
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

  // Initialize OpenLayers map
  useEffect(() => {
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
    
    // Remove existing overlay layer
    map.getLayers().forEach((layer: any) => {
      if (layer.get('name') === 'pdf-overlay') {
        map.removeLayer(layer);
      }
    });

    // Add new overlay layer
    const overlayLayer = new ol.layer.Image({
      source: new ol.source.ImageStatic({
        url: pdfImageData,
        imageExtent: ol.proj.transformExtent(bounds, 'EPSG:4326', 'EPSG:3857'),
      }),
      opacity: 0.7,
      name: 'pdf-overlay'
    });

    map.addLayer(overlayLayer);
    
    // Fit view to overlay extent
    const extent = ol.proj.transformExtent(bounds, 'EPSG:4326', 'EPSG:3857');
    map.getView().fit(extent, { padding: [20, 20, 20, 20] });

    setCompletedSteps(prev => [...prev, "georeference"]);
    setCurrentStep("zones");
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

            {/* Step Content */}
            <div className="space-y-6">
              {currentStep === "upload" && (
                <PDFUpload onPDFUploaded={handlePDFUploaded} />
              )}

              {currentStep === "georeference" && (
                <Georeferencing 
                  onGeoreference={handleGeoreference}
                  disabled={!pdfImageData}
                />
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