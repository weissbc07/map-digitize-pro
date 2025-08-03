import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Plus, Edit, Trash2 } from "lucide-react";

export interface ZoningType {
  id: string;
  name: string;
  code: string;
  color: string;
  description?: string;
}

export interface DetectedLegend {
  zones: ZoningType[];
  confidence: number;
  legendLocation: string;
  mapScale?: string;
  reasoning: string;
}

export interface VectorFeature {
  id: string;
  type: 'polygon' | 'rectangle' | 'circle' | 'freehand';
  zoneType: ZoningType;
  coordinates: number[][][];
  properties: {
    area: number;
    perimeter: number;
    created: string;
    modified?: string;
  };
}

export interface EditingMode {
  type: 'select' | 'vertex' | 'split' | 'merge' | 'buffer' | 'measure';
  active: boolean;
  options?: any;
}

interface ZoningTypesProps {
  zoningTypes: ZoningType[];
  onUpdateZoningTypes: (types: ZoningType[]) => void;
  selectedType: ZoningType | null;
  onSelectType: (type: ZoningType) => void;
}

export const ZoningTypes = ({ 
  zoningTypes, 
  onUpdateZoningTypes, 
  selectedType, 
  onSelectType 
}: ZoningTypesProps) => {
  const [showAllTypes, setShowAllTypes] = useState(false);

  const displayedTypes = showAllTypes ? zoningTypes : zoningTypes.slice(0, 8);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addCustomType = () => {
    const newType: ZoningType = {
      id: generateId(),
      name: "Custom Zone",
      code: "CZ",
      color: "#6366f1",
      description: "Custom zoning type"
    };
    onUpdateZoningTypes([...zoningTypes, newType]);
  };

  const removeType = (id: string) => {
    onUpdateZoningTypes(zoningTypes.filter(type => type.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Zoning Types
        </CardTitle>
        <CardDescription>
          Select zone types for drawing. Pre-loaded with Sturgeon Bay zones.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {displayedTypes.map((type) => (
            <div
              key={type.id}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-smooth ${
                selectedType?.id === type.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }`}
              onClick={() => onSelectType(type)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-sm border"
                  style={{ backgroundColor: type.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{type.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {type.code}
                    </Badge>
                  </div>
                  {type.description && (
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  )}
                </div>
              </div>
              
              {type.id.startsWith('custom-') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeType(type.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {zoningTypes.length > 8 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllTypes(!showAllTypes)}
            className="w-full"
          >
            {showAllTypes ? "Show Less" : `Show All (${zoningTypes.length})`}
          </Button>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={addCustomType}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Type
          </Button>
        </div>

        {selectedType && (
          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-sm font-medium">Selected: {selectedType.name}</p>
            <p className="text-xs text-muted-foreground">
              New zones will be drawn as {selectedType.code}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>• Click a zone type to select it for drawing</p>
          <p>• Selected zones will use the chosen type and color</p>
        </div>
      </CardContent>
    </Card>
  );
};