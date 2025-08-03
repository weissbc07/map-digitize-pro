import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Crop, 
  Eye, 
  Check, 
  X, 
  RefreshCw, 
  AlertCircle, 
  Sparkles,
  Loader2,
  Scissors
} from "lucide-react";
import { detectMapCropRegions, type MapCropSuggestion } from "@/services/ai-vision";
import { cropImageFromDataUrl, createCropPreview } from "@/utils/image-cropping";

interface MapCropperProps {
  pdfImageUrl: string;
  onCroppedImages: (mapImage: string, legendImage?: string) => void;
  onSkipCropping: () => void;
  isAIEnabled: boolean;
}

export const MapCropper = ({
  pdfImageUrl,
  onCroppedImages,
  onSkipCropping,
  isAIEnabled
}: MapCropperProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cropSuggestion, setCropSuggestion] = useState<MapCropSuggestion | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDetectCropRegions = async () => {
    if (!isAIEnabled) {
      toast.error("Please set up OpenAI API key first");
      return;
    }

    setIsAnalyzing(true);
    try {
      const suggestion = await detectMapCropRegions(pdfImageUrl);
      setCropSuggestion(suggestion);
      
      // Create preview image
      const preview = await createCropPreview(
        pdfImageUrl, 
        suggestion.mapRegion, 
        suggestion.legendRegion
      );
      setPreviewImage(preview);
      
      if (suggestion.confidence > 0.7) {
        toast.success(`Crop regions detected with ${Math.round(suggestion.confidence * 100)}% confidence`);
      } else {
        toast.warning(`Crop regions detected with low confidence (${Math.round(suggestion.confidence * 100)}%)`);
      }
    } catch (error) {
      console.error("Crop detection failed:", error);
      toast.error("Failed to detect crop regions. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptCropping = async () => {
    if (!cropSuggestion) return;

    setIsProcessing(true);
    try {
      // Crop the map region
      const croppedMap = await cropImageFromDataUrl(pdfImageUrl, cropSuggestion.mapRegion);
      
      // Crop the legend region if it exists
      let croppedLegend: string | undefined;
      if (cropSuggestion.legendRegion && !cropSuggestion.mapOnly) {
        croppedLegend = await cropImageFromDataUrl(pdfImageUrl, cropSuggestion.legendRegion);
      }
      
      onCroppedImages(croppedMap, croppedLegend);
      toast.success("Images cropped successfully!");
    } catch (error) {
      console.error("Cropping failed:", error);
      toast.error("Failed to crop images. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectCropping = () => {
    setCropSuggestion(null);
    setPreviewImage(null);
    setShowPreview(false);
    toast.info("Crop suggestion discarded");
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
          <Crop className="w-5 h-5" />
          Smart Map Cropping
        </CardTitle>
        <CardDescription>
          Automatically separate map and legend for better overlay accuracy
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

        {/* Original PDF Preview */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Original PDF Map</span>
          <div className="border rounded-lg overflow-hidden bg-secondary/20">
            <img 
              src={pdfImageUrl} 
              alt="Original PDF Map" 
              className="w-full h-48 object-contain"
            />
          </div>
        </div>

        {/* Detection Controls */}
        <div className="space-y-2">
          <Button
            onClick={handleDetectCropRegions}
            disabled={!isAIEnabled || isAnalyzing}
            className="w-full"
            variant={cropSuggestion ? "outline" : "default"}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Map Layout...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {cropSuggestion ? "Re-analyze Layout" : "Detect Map & Legend"}
              </>
            )}
          </Button>
        </div>

        {/* Crop Results */}
        {cropSuggestion && (
          <div className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Detection Results</span>
                <Badge 
                  variant={getConfidenceBadgeVariant(cropSuggestion.confidence)}
                  className={getConfidenceColor(cropSuggestion.confidence)}
                >
                  {Math.round(cropSuggestion.confidence * 100)}% confidence
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Map region:</span>
                  <span className="font-medium">
                    {cropSuggestion.mapRegion.width.toFixed(0)}% × {cropSuggestion.mapRegion.height.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Legend region:</span>
                  <span className="font-medium">
                    {cropSuggestion.legendRegion 
                      ? `${cropSuggestion.legendRegion.width.toFixed(0)}% × ${cropSuggestion.legendRegion.height.toFixed(0)}%`
                      : "Integrated in map"
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Layout type:</span>
                  <span className="font-medium">
                    {cropSuggestion.mapOnly ? "Map with integrated legend" : "Separate map and legend"}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                <p>{cropSuggestion.reasoning}</p>
              </div>
            </div>

            {/* Preview Toggle */}
            {previewImage && (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? "Hide" : "Show"} Crop Preview
                </Button>

                {showPreview && (
                  <div className="border rounded-lg overflow-hidden bg-secondary/20">
                    <img 
                      src={previewImage} 
                      alt="Crop Preview" 
                      className="w-full h-64 object-contain"
                    />
                    <div className="p-2 bg-secondary text-xs text-center">
                      <span className="text-green-600 font-medium">Green: Map Region</span>
                      {cropSuggestion.legendRegion && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-blue-600 font-medium">Blue: Legend Region</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleAcceptCropping}
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4 mr-2" />
                    Crop & Use
                  </>
                )}
              </Button>
              <Button
                onClick={handleRejectCropping}
                variant="outline"
                className="flex-1"
                disabled={isProcessing}
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        )}

        {/* Skip Option */}
        <div className="pt-4 border-t">
          <Button
            onClick={onSkipCropping}
            variant="ghost"
            className="w-full"
            disabled={isProcessing}
          >
            Skip Cropping - Use Original Image
          </Button>
        </div>

        {/* Usage Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• <strong>Cropping Benefits:</strong> Removes legend for cleaner map overlay</p>
          <p>• <strong>Map Region:</strong> Geographic content optimized for georeferencing</p>
          <p>• <strong>Legend Region:</strong> Separate legend for better analysis</p>
          <p>• <strong>Skip Option:</strong> Use original image if cropping isn't helpful</p>
        </div>
      </CardContent>
    </Card>
  );
};