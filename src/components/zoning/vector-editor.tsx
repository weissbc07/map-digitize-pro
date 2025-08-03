import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Edit3, 
  Square, 
  Circle, 
  Pentagon, 
  PenTool, 
  MousePointer2,
  Move3D,
  Split,
  Merge,
  Compass,
  Ruler,
  Target,
  Undo2,
  Redo2,
  Settings
} from "lucide-react";
import type { ZoningType, EditingMode, VectorFeature } from "./zoning-types";

interface VectorEditorProps {
  selectedZoneType: ZoningType | null;
  editingMode: EditingMode;
  onEditingModeChange: (mode: EditingMode) => void;
  onStartDrawing: (type: 'polygon' | 'rectangle' | 'circle' | 'freehand') => void;
  onStopDrawing: () => void;
  isDrawing: boolean;
  selectedFeatures: VectorFeature[];
  onFeaturesSelected: (features: VectorFeature[]) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  snapTolerance: number;
  onSnapToleranceChange: (tolerance: number) => void;
  snapEnabled: boolean;
  onSnapEnabledChange: (enabled: boolean) => void;
}

type DrawingMode = 'polygon' | 'rectangle' | 'circle' | 'freehand';

export const VectorEditor = ({
  selectedZoneType,
  editingMode,
  onEditingModeChange,
  onStartDrawing,
  onStopDrawing,
  isDrawing,
  selectedFeatures,
  onFeaturesSelected,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  snapTolerance,
  onSnapToleranceChange,
  snapEnabled,
  onSnapEnabledChange
}: VectorEditorProps) => {
  const [activeDrawingMode, setActiveDrawingMode] = useState<DrawingMode>('polygon');
  const [showSnapSettings, setShowSnapSettings] = useState(false);

  const drawingModes = [
    { type: 'polygon' as DrawingMode, icon: Pentagon, label: 'Polygon', description: 'Draw custom polygon' },
    { type: 'rectangle' as DrawingMode, icon: Square, label: 'Rectangle', description: 'Draw rectangle' },
    { type: 'circle' as DrawingMode, icon: Circle, label: 'Circle', description: 'Draw circle' },
    { type: 'freehand' as DrawingMode, icon: PenTool, label: 'Freehand', description: 'Draw freehand shape' }
  ];

  const editingModes = [
    { type: 'select' as const, icon: MousePointer2, label: 'Select', description: 'Select and move features' },
    { type: 'vertex' as const, icon: Edit3, label: 'Edit Vertices', description: 'Edit feature vertices' },
    { type: 'split' as const, icon: Split, label: 'Split', description: 'Split features' },
    { type: 'merge' as const, icon: Merge, label: 'Merge', description: 'Merge selected features' },
    { type: 'buffer' as const, icon: Move3D, label: 'Buffer', description: 'Create buffer zones' },
    { type: 'measure' as const, icon: Ruler, label: 'Measure', description: 'Measure distances and areas' }
  ];

  const handleStartDrawing = useCallback(() => {
    if (!selectedZoneType) {
      toast.error("Please select a zone type first");
      return;
    }
    onStartDrawing(activeDrawingMode);
    toast.info(`Drawing ${activeDrawingMode} mode activated`);
  }, [selectedZoneType, activeDrawingMode, onStartDrawing]);

  const handleStopDrawing = useCallback(() => {
    onStopDrawing();
    toast.success("Drawing mode stopped");
  }, [onStopDrawing]);

  const handleEditingModeChange = useCallback((mode: EditingMode['type']) => {
    const newMode: EditingMode = { type: mode, active: true };
    onEditingModeChange(newMode);
    toast.info(`${editingModes.find(m => m.type === mode)?.label} mode activated`);
  }, [onEditingModeChange, editingModes]);

  const handleUndo = useCallback(() => {
    onUndo();
    toast.success("Action undone");
  }, [onUndo]);

  const handleRedo = useCallback(() => {
    onRedo();
    toast.success("Action redone");
  }, [onRedo]);

  const toggleSnap = useCallback(() => {
    onSnapEnabledChange(!snapEnabled);
    toast.info(snapEnabled ? "Snapping disabled" : "Snapping enabled");
  }, [snapEnabled, onSnapEnabledChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="w-5 h-5" />
          Vector Editor
        </CardTitle>
        <CardDescription>
          Advanced drawing and editing tools for precise zone creation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Zone Type */}
        {selectedZoneType && (
          <div className="p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: selectedZoneType.color }}
              />
              <span className="font-medium text-sm">{selectedZoneType.name}</span>
              <Badge variant="outline" className="text-xs">
                {selectedZoneType.code}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Active zone type for new features
            </p>
          </div>
        )}

        {/* Drawing Tools */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Drawing Tools</span>
            {isDrawing && (
              <Badge variant="default" className="text-xs">
                Drawing Active
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {drawingModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeDrawingMode === mode.type;
              return (
                <Button
                  key={mode.type}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="h-auto p-3 flex-col gap-1"
                  onClick={() => setActiveDrawingMode(mode.type)}
                  disabled={isDrawing && !isActive}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{mode.label}</span>
                </Button>
              );
            })}
          </div>

          <div className="flex gap-2">
            {!isDrawing ? (
              <Button
                onClick={handleStartDrawing}
                disabled={!selectedZoneType}
                className="flex-1"
                variant={selectedZoneType ? "default" : "outline"}
              >
                Start Drawing
              </Button>
            ) : (
              <Button
                onClick={handleStopDrawing}
                variant="destructive"
                className="flex-1"
              >
                Stop Drawing
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Editing Tools */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Editing Tools</span>
            {editingMode.active && (
              <Badge variant="secondary" className="text-xs">
                {editingModes.find(m => m.type === editingMode.type)?.label}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {editingModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = editingMode.type === mode.type && editingMode.active;
              return (
                <Button
                  key={mode.type}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="h-auto p-2 flex-col gap-1"
                  onClick={() => handleEditingModeChange(mode.type)}
                  title={mode.description}
                >
                  <Icon className="w-3 h-3" />
                  <span className="text-xs">{mode.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Selection Info */}
        {selectedFeatures.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Selected Features</span>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">Features selected:</span>
                <Badge variant="default">{selectedFeatures.length}</Badge>
              </div>
              {selectedFeatures.length === 1 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>Type: {selectedFeatures[0].type}</p>
                  <p>Zone: {selectedFeatures[0].zoneType.name}</p>
                  <p>Area: {Math.round(selectedFeatures[0].properties.area)} m²</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Controls */}
        <div className="space-y-3">
          <span className="text-sm font-medium">History</span>
          <div className="flex gap-2">
            <Button
              onClick={handleUndo}
              disabled={!canUndo}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Undo2 className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button
              onClick={handleRedo}
              disabled={!canRedo}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Redo2 className="w-4 h-4 mr-2" />
              Redo
            </Button>
          </div>
        </div>

        <Separator />

        {/* Snapping Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Snapping</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSnapSettings(!showSnapSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={toggleSnap}
              variant={snapEnabled ? "default" : "outline"}
              size="sm"
              className="flex-1"
            >
              <Target className="w-4 h-4 mr-2" />
              {snapEnabled ? "Snap On" : "Snap Off"}
            </Button>
            <Badge variant="secondary" className="text-xs">
              {snapTolerance}px
            </Badge>
          </div>

          {showSnapSettings && (
            <div className="p-3 bg-secondary rounded-lg space-y-2">
              <label className="text-xs font-medium">Snap Tolerance (pixels)</label>
              <input
                type="range"
                min="5"
                max="50"
                value={snapTolerance}
                onChange={(e) => onSnapToleranceChange(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5px</span>
                <span>{snapTolerance}px</span>
                <span>50px</span>
              </div>
            </div>
          )}
        </div>

        {/* Usage Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• <strong>Drawing:</strong> Select tool and zone type, then click Start Drawing</p>
          <p>• <strong>Editing:</strong> Select features first, then choose editing tool</p>
          <p>• <strong>Snapping:</strong> Helps align features to existing geometry</p>
          <p>• <strong>History:</strong> Undo/redo up to 50 recent actions</p>
        </div>
      </CardContent>
    </Card>
  );
};