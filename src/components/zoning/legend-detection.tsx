import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, Eye, Check, X, RefreshCw, AlertCircle } from "lucide-react";
import { detectZoningLegend } from "@/services/ai-vision";
import type { DetectedLegend, ZoningType } from "./zoning-types";

interface LegendDetectionProps {
  pdfImageUrl?: string;
  onLegendDetected: (legend: DetectedLegend) => void;
  onZoneTypesAccepted: (zoneTypes: ZoningType[]) => void;
  disabled?: boolean;
  isAIEnabled: boolean;
}

export const LegendDetection = ({
  pdfImageUrl,
  onLegendDetected,
  onZoneTypesAccepted,
  disabled,
  isAIEnabled
}: LegendDetectionProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedLegend, setDetectedLegend] = useState<DetectedLegend | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleDetectLegend = async () => {
    if (!pdfImageUrl) {
      toast.error("No PDF image available for analysis");
      return;
    }

    if (!isAIEnabled) {
      toast.error("Please set up OpenAI API key first");
      return;
    }

    setIsAnalyzing(true);
    try {
      const legend = await detectZoningLegend(pdfImageUrl);
      setDetectedLegend(legend);
      onLegendDetected(legend);
      
      if (legend.confidence > 0.7) {
        toast.success(`Legend detected with ${Math.round(legend.confidence * 100)}% confidence`);
      } else {
        toast.warning(`Legend detected with low confidence (${Math.round(legend.confidence * 100)}%)`);
      }
    } catch (error) {
      console.error("Legend detection failed:", error);
      toast.error("Failed to detect legend. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptLegend = () => {
    if (!detectedLegend) return;
    
    onZoneTypesAccepted(detectedLegend.zones);
    toast.success(`Added ${detectedLegend.zones.length} zone types from detected legend`);
  };

  const handleRejectLegend = () => {
    setDetectedLegend(null);
    toast.info("Legend detection results discarded");
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return "text-green-600";
    if (confidence > 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence > 0.8) return "default";
    if (confidence > 0.6) return "secondary";
    return "destructive";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Legend Detection
        </CardTitle>
        <CardDescription>
          Automatically detect zone types and colors from the map legend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAIEnabled && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">AI features require OpenAI API key</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button
            onClick={handleDetectLegend}
            disabled={disabled || !pdfImageUrl || !isAIEnabled || isAnalyzing}
            className="w-full"
            variant={detectedLegend ? "outline" : "default"}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Legend...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                {detectedLegend ? "Re-analyze Legend" : "Detect Legend"}
              </>
            )}
          </Button>
        </div>

        {detectedLegend && (
          <div className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Detection Results</span>
                <Badge 
                  variant={getConfidenceBadgeVariant(detectedLegend.confidence)}
                  className={getConfidenceColor(detectedLegend.confidence)}
                >
                  {Math.round(detectedLegend.confidence * 100)}% confidence
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zone types found:</span>
                  <span className="font-medium">{detectedLegend.zones.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Legend location:</span>
                  <span className="font-medium">{detectedLegend.legendLocation}</span>
                </div>
                {detectedLegend.mapScale && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Map scale:</span>
                    <span className="font-medium">{detectedLegend.mapScale}</span>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="mt-2 w-full"
              >
                {showDetails ? "Hide" : "Show"} AI Reasoning
              </Button>

              {showDetails && (
                <div className="mt-3 p-3 bg-background rounded border text-xs text-muted-foreground">
                  {detectedLegend.reasoning}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Detected Zone Types:</span>
              <div className="grid gap-2 max-h-48 overflow-y-auto">
                {detectedLegend.zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm border"
                        style={{ backgroundColor: zone.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{zone.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {zone.code}
                          </Badge>
                        </div>
                        {zone.description && (
                          <p className="text-xs text-muted-foreground">{zone.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAcceptLegend}
                className="flex-1"
                variant="default"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept & Use
              </Button>
              <Button
                onClick={handleRejectLegend}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• AI analyzes the map legend to extract zone types and colors</p>
          <p>• Review detected zones before accepting them</p>
          <p>• You can manually add or edit zone types after detection</p>
          <p>• Higher confidence scores indicate more reliable detection</p>
        </div>
      </CardContent>
    </Card>
  );
};