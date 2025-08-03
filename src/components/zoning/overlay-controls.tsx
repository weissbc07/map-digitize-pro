import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Move, RotateCw, ZoomIn, ZoomOut, Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import { calculateAlignment, type AlignmentSuggestion } from "@/services/ai-vision";

interface OverlayControlsProps {
  onScaleChange: (scale: number) => void;
  onOpacityChange: (opacity: number) => void;
  onPositionChange: (deltaX: number, deltaY: number) => void;
  onRotationChange: (rotation: number) => void;
  overlayVisible: boolean;
  onToggleOverlay: () => void;
  overlayReady: boolean;
  isAIEnabled: boolean;
  pdfImageUrl?: string;
  onAutoAlign?: () => Promise<void>;
}

export const OverlayControls = ({
  onScaleChange,
  onOpacityChange,
  onPositionChange,
  onRotationChange,
  overlayVisible,
  onToggleOverlay,
  overlayReady,
  isAIEnabled,
  pdfImageUrl,
  onAutoAlign
}: OverlayControlsProps) => {
  const [scale, setScale] = useState([1]);
  const [opacity, setOpacity] = useState([0.7]);
  const [rotation, setRotation] = useState([0]);
  const [isAutoAligning, setIsAutoAligning] = useState(false);
  const [alignmentSuggestion, setAlignmentSuggestion] = useState<AlignmentSuggestion | null>(null);

  const handleScaleChange = (value: number[]) => {
    setScale(value);
    onScaleChange(value[0]);
  };

  const handleOpacityChange = (value: number[]) => {
    setOpacity(value);
    onOpacityChange(value[0]);
  };

  const handleRotationChange = (value: number[]) => {
    setRotation(value);
    onRotationChange(value[0]);
  };

  const handlePositionMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    const moveDistance = 0.001; // Small increment for position adjustment
    switch (direction) {
      case 'up':
        onPositionChange(0, moveDistance);
        break;
      case 'down':
        onPositionChange(0, -moveDistance);
        break;
      case 'left':
        onPositionChange(-moveDistance, 0);
        break;
      case 'right':
        onPositionChange(moveDistance, 0);
        break;
    }
  };

  const resetTransforms = () => {
    setScale([1]);
    setOpacity([0.7]);
    setRotation([0]);
    onScaleChange(1);
    onOpacityChange(0.7);
    onRotationChange(0);
    setAlignmentSuggestion(null);
    toast.success("Overlay reset to default");
  };

  const handleAutoAlign = async () => {
    if (!onAutoAlign || !isAIEnabled) return;
    
    setIsAutoAligning(true);
    try {
      await onAutoAlign();
      toast.success('AI alignment completed');
    } catch (error) {
      console.error('Auto-alignment failed:', error);
      toast.error('Auto-alignment failed. Please try manual adjustment.');
    } finally {
      setIsAutoAligning(false);
    }
  };

  const handleAcceptAlignment = () => {
    if (!alignmentSuggestion) return;
    
    setScale([alignmentSuggestion.scale]);
    setRotation([alignmentSuggestion.rotation]);
    onScaleChange(alignmentSuggestion.scale);
    onRotationChange(alignmentSuggestion.rotation);
    setAlignmentSuggestion(null);
    toast.success('AI alignment applied');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Move className="w-5 h-5" />
          Overlay Controls
        </CardTitle>
        <CardDescription>
          Adjust the PDF overlay to align with the base map
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleOverlay}
            disabled={!overlayReady}
            className="flex items-center gap-1"
          >
            {overlayVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {overlayVisible ? "Hide" : "Show"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetTransforms}
            disabled={!overlayReady}
          >
            Reset
          </Button>
        </div>

        {isAIEnabled && overlayReady && (
          <Button 
            onClick={handleAutoAlign}
            disabled={isAutoAligning}
            className="w-full"
          >
            {isAutoAligning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                AI Aligning...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Auto-Align with AI
              </>
            )}
          </Button>
        )}

        {alignmentSuggestion && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">AI alignment suggestion</span>
                  <Badge variant="secondary">
                    {Math.round(alignmentSuggestion.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {alignmentSuggestion.reasoning}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    onClick={handleAcceptAlignment}
                  >
                    Apply Changes
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setAlignmentSuggestion(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {overlayReady && (
          <>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Scale: {scale[0].toFixed(2)}x</Label>
              <Slider
                value={scale}
                onValueChange={handleScaleChange}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleScaleChange([Math.max(0.1, scale[0] - 0.1)])}
                >
                  <ZoomOut className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleScaleChange([Math.min(3, scale[0] + 0.1)])}
                >
                  <ZoomIn className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Opacity: {Math.round(opacity[0] * 100)}%</Label>
              <Slider
                value={opacity}
                onValueChange={handleOpacityChange}
                min={0.1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Rotation: {rotation[0]}°</Label>
              <Slider
                value={rotation}
                onValueChange={handleRotationChange}
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Position</Label>
              <div className="grid grid-cols-3 gap-1 w-fit mx-auto">
                <div></div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePositionMove('up')}
                  className="w-8 h-8 p-0"
                >
                  ↑
                </Button>
                <div></div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePositionMove('left')}
                  className="w-8 h-8 p-0"
                >
                  ←
                </Button>
                <div className="w-8 h-8 flex items-center justify-center">
                  <Move className="w-4 h-4 text-muted-foreground" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePositionMove('right')}
                  className="w-8 h-8 p-0"
                >
                  →
                </Button>
                <div></div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePositionMove('down')}
                  className="w-8 h-8 p-0"
                >
                  ↓
                </Button>
                <div></div>
              </div>
            </div>
          </>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Use scale to resize the PDF overlay</p>
          <p>• Adjust opacity to see through to the base map</p>
          <p>• Use position controls for fine adjustment</p>
          <p>• Rotation helps align tilted maps</p>
        </div>
      </CardContent>
    </Card>
  );
};