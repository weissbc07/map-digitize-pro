import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Info, 
  Edit, 
  Save, 
  X, 
  MapPin, 
  Ruler, 
  Calendar,
  Palette,
  Copy,
  Layers
} from "lucide-react";
import type { VectorFeature, ZoningType } from "./zoning-types";

interface FeaturePropertiesProps {
  selectedFeatures: VectorFeature[];
  availableZoneTypes: ZoningType[];
  onUpdateFeature: (id: string, updates: Partial<VectorFeature>) => void;
  onUpdateSelectedFeatures: (updates: Partial<VectorFeature>) => void;
  onSetZoneTypeForSelected: (zoneType: ZoningType) => void;
}

export const FeatureProperties = ({
  selectedFeatures,
  availableZoneTypes,
  onUpdateFeature,
  onUpdateSelectedFeatures,
  onSetZoneTypeForSelected
}: FeaturePropertiesProps) => {
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    zoneName?: string;
    description?: string;
  }>({});

  const singleFeature = selectedFeatures.length === 1 ? selectedFeatures[0] : null;
  const multipleFeatures = selectedFeatures.length > 1;

  const formatArea = (area: number): string => {
    if (area > 10000) {
      return `${(area / 10000).toFixed(2)} ha`;
    }
    return `${area.toFixed(0)} m²`;
  };

  const formatPerimeter = (perimeter: number): string => {
    if (perimeter > 1000) {
      return `${(perimeter / 1000).toFixed(2)} km`;
    }
    return `${perimeter.toFixed(0)} m`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const handleStartEdit = (featureId: string) => {
    const feature = selectedFeatures.find(f => f.id === featureId);
    if (feature) {
      setEditingFeatureId(featureId);
      setEditValues({
        zoneName: feature.zoneType.name,
        description: feature.zoneType.description || ''
      });
    }
  };

  const handleSaveEdit = () => {
    if (!editingFeatureId || !editValues.zoneName) return;

    const feature = selectedFeatures.find(f => f.id === editingFeatureId);
    if (!feature) return;

    const updatedZoneType: ZoningType = {
      ...feature.zoneType,
      name: editValues.zoneName,
      description: editValues.description
    };

    onUpdateFeature(editingFeatureId, { zoneType: updatedZoneType });
    setEditingFeatureId(null);
    setEditValues({});
    toast.success("Feature properties updated");
  };

  const handleCancelEdit = () => {
    setEditingFeatureId(null);
    setEditValues({});
  };

  const handleZoneTypeChange = (zoneType: ZoningType) => {
    if (multipleFeatures) {
      onSetZoneTypeForSelected(zoneType);
      toast.success(`Updated zone type for ${selectedFeatures.length} features`);
    } else if (singleFeature) {
      onUpdateFeature(singleFeature.id, { zoneType });
      toast.success("Zone type updated");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getTotalArea = (): number => {
    return selectedFeatures.reduce((total, feature) => total + feature.properties.area, 0);
  };

  const getTotalPerimeter = (): number => {
    return selectedFeatures.reduce((total, feature) => total + feature.properties.perimeter, 0);
  };

  if (selectedFeatures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Feature Properties
          </CardTitle>
          <CardDescription>
            Select features to view and edit their properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No features selected</p>
            <p className="text-sm">Click on features to select them</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Feature Properties
        </CardTitle>
        <CardDescription>
          {multipleFeatures 
            ? `${selectedFeatures.length} features selected`
            : "Single feature selected"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Statistics */}
        <div className="p-3 bg-secondary rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Area:</span>
              <div className="font-medium flex items-center gap-2">
                {formatArea(getTotalArea())}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1"
                  onClick={() => copyToClipboard(getTotalArea().toString(), "Area")}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Total Perimeter:</span>
              <div className="font-medium flex items-center gap-2">
                {formatPerimeter(getTotalPerimeter())}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1"
                  onClick={() => copyToClipboard(getTotalPerimeter().toString(), "Perimeter")}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Type Assignment for Multiple Features */}
        {multipleFeatures && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="font-medium">Batch Zone Assignment</span>
            </div>
            <div className="grid gap-2 max-h-48 overflow-y-auto">
              {availableZoneTypes.map((zoneType) => (
                <Button
                  key={zoneType.id}
                  variant="outline"
                  className="justify-start h-auto p-3"
                  onClick={() => handleZoneTypeChange(zoneType)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className="w-4 h-4 rounded-sm border"
                      style={{ backgroundColor: zoneType.color }}
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{zoneType.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {zoneType.code}
                        </Badge>
                      </div>
                      {zoneType.description && (
                        <p className="text-xs text-muted-foreground">{zoneType.description}</p>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Single Feature Details */}
        {singleFeature && (
          <div className="space-y-4">
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span className="font-medium">Feature Details</span>
              </div>

              {/* Basic Info */}
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="outline">{singleFeature.type}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Area:</span>
                  <span className="text-sm font-medium">
                    {formatArea(singleFeature.properties.area)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Perimeter:</span>
                  <span className="text-sm font-medium">
                    {formatPerimeter(singleFeature.properties.perimeter)}
                  </span>
                </div>
              </div>

              {/* Zone Type Info */}
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Current Zone Type</span>
                  {editingFeatureId !== singleFeature.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEdit(singleFeature.id)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                {editingFeatureId === singleFeature.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="zoneName" className="text-xs">Zone Name</Label>
                      <Input
                        id="zoneName"
                        value={editValues.zoneName || ''}
                        onChange={(e) => setEditValues(prev => ({ ...prev, zoneName: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-xs">Description</Label>
                      <Input
                        id="description"
                        value={editValues.description || ''}
                        onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-sm border"
                      style={{ backgroundColor: singleFeature.zoneType.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{singleFeature.zoneType.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {singleFeature.zoneType.code}
                        </Badge>
                      </div>
                      {singleFeature.zoneType.description && (
                        <p className="text-xs text-muted-foreground">
                          {singleFeature.zoneType.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Timeline</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Created: {formatDate(singleFeature.properties.created)}</p>
                  {singleFeature.properties.modified && (
                    <p>Modified: {formatDate(singleFeature.properties.modified)}</p>
                  )}
                </div>
              </div>

              {/* Change Zone Type */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Change Zone Type</span>
                <div className="grid gap-1 max-h-32 overflow-y-auto">
                  {availableZoneTypes
                    .filter(zt => zt.id !== singleFeature.zoneType.id)
                    .map((zoneType) => (
                    <Button
                      key={zoneType.id}
                      variant="ghost"
                      size="sm"
                      className="justify-start h-auto p-2"
                      onClick={() => handleZoneTypeChange(zoneType)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-sm border"
                          style={{ backgroundColor: zoneType.color }}
                        />
                        <span className="text-xs">{zoneType.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {zoneType.code}
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usage Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• <strong>Single selection:</strong> Edit individual feature properties</p>
          <p>• <strong>Multiple selection:</strong> Batch update zone types</p>
          <p>• <strong>Copy values:</strong> Click copy icons to copy measurements</p>
          <p>• <strong>Area/Perimeter:</strong> Automatically calculated from geometry</p>
        </div>
      </CardContent>
    </Card>
  );
};