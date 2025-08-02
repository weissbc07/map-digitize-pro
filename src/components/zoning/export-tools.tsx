import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, FileJson, Globe } from "lucide-react";

interface ExportToolsProps {
  onExportGeoJSON: () => void;
  onExportKML: () => void;
  featureCount: number;
  disabled?: boolean;
}

export const ExportTools = ({ 
  onExportGeoJSON, 
  onExportKML, 
  featureCount, 
  disabled 
}: ExportToolsProps) => {
  const handleExportGeoJSON = () => {
    if (featureCount === 0) {
      toast.error("No zones to export");
      return;
    }
    onExportGeoJSON();
    toast.success("GeoJSON file downloaded successfully!");
  };

  const handleExportKML = () => {
    if (featureCount === 0) {
      toast.error("No zones to export");
      return;
    }
    onExportKML();
    toast.success("KML file downloaded successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Data
        </CardTitle>
        <CardDescription>
          Download your digitized zones as GIS files
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
          <span className="text-sm font-medium">Zones ready for export:</span>
          <Badge variant={featureCount > 0 ? "default" : "secondary"}>
            {featureCount}
          </Badge>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleExportGeoJSON}
            disabled={disabled || featureCount === 0}
            className="w-full justify-start"
            variant="outline"
          >
            <FileJson className="w-4 h-4 mr-2" />
            Export as GeoJSON
            <span className="ml-auto text-xs text-muted-foreground">
              .geojson
            </span>
          </Button>

          <Button
            onClick={handleExportKML}
            disabled={disabled || featureCount === 0}
            className="w-full justify-start"
            variant="outline"
          >
            <Globe className="w-4 h-4 mr-2" />
            Export as KML
            <span className="ml-auto text-xs text-muted-foreground">
              .kml
            </span>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• <strong>GeoJSON:</strong> For web mapping and modern GIS</p>
          <p>• <strong>KML:</strong> For Google Earth and legacy systems</p>
          <p>• Files include zone properties and metadata</p>
        </div>

        {featureCount === 0 && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              Draw some zones to enable export
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};