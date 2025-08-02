import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Pencil, Square, StopCircle, Trash2, Map } from "lucide-react";
import type { ZoningType } from "./zoning-types";

interface DrawingToolsProps {
  selectedZoneType: ZoningType | null;
  isDrawing: boolean;
  onStartDrawing: () => void;
  onStopDrawing: () => void;
  onClearAll: () => void;
  featureCount: number;
}

export const DrawingTools = ({
  selectedZoneType,
  isDrawing,
  onStartDrawing,
  onStopDrawing,
  onClearAll,
  featureCount
}: DrawingToolsProps) => {
  const handleStartDrawing = () => {
    if (!selectedZoneType) {
      toast.error("Please select a zone type first");
      return;
    }
    onStartDrawing();
    toast.info("Click on the map to start drawing a zone boundary");
  };

  const handleStopDrawing = () => {
    onStopDrawing();
    toast.success("Drawing mode stopped");
  };

  const handleClearAll = () => {
    if (featureCount === 0) {
      toast.info("No zones to clear");
      return;
    }
    onClearAll();
    toast.success("All zones cleared");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pencil className="w-5 h-5" />
          Drawing Tools
        </CardTitle>
        <CardDescription>
          Draw zone boundaries on the map
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
              New zones will be drawn with this type
            </p>
          </div>
        )}

        <div className="space-y-2">
          {!isDrawing ? (
            <Button
              onClick={handleStartDrawing}
              disabled={!selectedZoneType}
              className="w-full"
              variant={selectedZoneType ? "default" : "outline"}
            >
              <Square className="w-4 h-4 mr-2" />
              Start Drawing Zone
            </Button>
          ) : (
            <Button
              onClick={handleStopDrawing}
              variant="destructive"
              className="w-full"
            >
              <StopCircle className="w-4 h-4 mr-2" />
              Stop Drawing
            </Button>
          )}

          <Button
            onClick={handleClearAll}
            variant="outline"
            className="w-full"
            disabled={featureCount === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Zones
          </Button>
        </div>

        {isDrawing && (
          <div className="p-3 bg-drawing-active/10 border border-drawing-active/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-drawing-active rounded-full animate-pulse" />
              <span className="text-sm font-medium text-drawing-active">
                Drawing Mode Active
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Click points on the map to create zone boundary. Double-click to finish.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Zones drawn:</span>
          <Badge variant="secondary">{featureCount}</Badge>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Select a zone type before drawing</p>
          <p>• Click points to create polygon boundaries</p>
          <p>• Double-click to complete a zone</p>
          <p>• Each zone inherits the selected type's properties</p>
        </div>
      </CardContent>
    </Card>
  );
};