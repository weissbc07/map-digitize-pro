import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, Eye, EyeOff } from "lucide-react";

interface GeoreferencingProps {
  onGeoreference: (bounds: [number, number, number, number]) => void;
  disabled?: boolean;
}

export const Georeferencing = ({ onGeoreference, disabled }: GeoreferencingProps) => {
  const [swLat, setSwLat] = useState("44.8200");
  const [swLng, setSwLng] = useState("-87.4000");
  const [neLat, setNeLat] = useState("44.8600");
  const [neLng, setNeLng] = useState("-87.3400");
  const [overlayVisible, setOverlayVisible] = useState(true);

  const validateCoordinates = () => {
    const sw = [parseFloat(swLat), parseFloat(swLng)];
    const ne = [parseFloat(neLat), parseFloat(neLng)];

    if (sw.some(isNaN) || ne.some(isNaN)) {
      toast.error("Please enter valid coordinates");
      return false;
    }

    if (sw[0] >= ne[0] || sw[1] >= ne[1]) {
      toast.error("Southwest corner must be south and west of northeast corner");
      return false;
    }

    if (Math.abs(sw[0]) > 90 || Math.abs(ne[0]) > 90) {
      toast.error("Latitude must be between -90 and 90 degrees");
      return false;
    }

    if (Math.abs(sw[1]) > 180 || Math.abs(ne[1]) > 180) {
      toast.error("Longitude must be between -180 and 180 degrees");
      return false;
    }

    return true;
  };

  const handleAddOverlay = () => {
    if (!validateCoordinates()) return;

    const bounds: [number, number, number, number] = [
      parseFloat(swLng), // west
      parseFloat(swLat), // south
      parseFloat(neLng), // east
      parseFloat(neLat)  // north
    ];

    onGeoreference(bounds);
    toast.success("Map overlay added successfully!");
  };

  const handlePresetSturgeon = () => {
    setSwLat("44.8200");
    setSwLng("-87.4000");
    setNeLat("44.8600");
    setNeLng("-87.3400");
    toast.info("Coordinates set for Sturgeon Bay, WI");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Georeference Map
        </CardTitle>
        <CardDescription>
          Set corner coordinates to position the PDF on the map
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sw-lat" className="text-sm font-medium">
              Southwest Latitude
            </Label>
            <Input
              id="sw-lat"
              type="number"
              step="any"
              value={swLat}
              onChange={(e) => setSwLat(e.target.value)}
              placeholder="44.8200"
              className="bg-coordinate-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sw-lng" className="text-sm font-medium">
              Southwest Longitude
            </Label>
            <Input
              id="sw-lng"
              type="number"
              step="any"
              value={swLng}
              onChange={(e) => setSwLng(e.target.value)}
              placeholder="-87.4000"
              className="bg-coordinate-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ne-lat" className="text-sm font-medium">
              Northeast Latitude
            </Label>
            <Input
              id="ne-lat"
              type="number"
              step="any"
              value={neLat}
              onChange={(e) => setNeLat(e.target.value)}
              placeholder="44.8600"
              className="bg-coordinate-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ne-lng" className="text-sm font-medium">
              Northeast Longitude
            </Label>
            <Input
              id="ne-lng"
              type="number"
              step="any"
              value={neLng}
              onChange={(e) => setNeLng(e.target.value)}
              placeholder="-87.3400"
              className="bg-coordinate-input"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePresetSturgeon}
            className="flex-1"
          >
            Use Sturgeon Bay
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOverlayVisible(!overlayVisible)}
            className="flex items-center gap-1"
          >
            {overlayVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {overlayVisible ? "Hide" : "Show"}
          </Button>
        </div>

        <Button
          onClick={handleAddOverlay}
          disabled={disabled}
          className="w-full"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Add Map Overlay
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Use decimal degrees (e.g., 44.8200, -87.4000)</p>
          <p>• Southwest corner should be bottom-left of your map</p>
          <p>• Northeast corner should be top-right of your map</p>
        </div>
      </CardContent>
    </Card>
  );
};