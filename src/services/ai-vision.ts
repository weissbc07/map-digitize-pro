import OpenAI from 'openai';
import type { DetectedLegend } from '@/components/zoning/zoning-types';

// Initialize OpenAI client - will need API key from user
let openai: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export interface MapFeature {
  type: 'intersection' | 'landmark' | 'road' | 'text' | 'coordinate';
  description: string;
  confidence: number;
  location?: { x: number; y: number };
}

export interface AlignmentSuggestion {
  scale: number;
  rotation: number;
  position: { x: number; y: number };
  confidence: number;
  reasoning: string;
}

export interface CoordinateSuggestion {
  southwest: { lat: number; lng: number };
  northeast: { lat: number; lng: number };
  confidence: number;
  reasoning: string;
}

export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MapCropSuggestion {
  mapRegion: CropRegion;
  legendRegion: CropRegion | null;
  confidence: number;
  reasoning: string;
  mapOnly?: boolean; // true if no separate legend was detected
}

export const analyzeMapForFeatures = async (imageDataUrl: string): Promise<MapFeature[]> => {
  if (!openai) {
    throw new Error('OpenAI not initialized. Please provide an API key.');
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this map image and identify key features that could be used for alignment:
            - Street intersections and road networks
            - Landmark buildings and structures
            - Geographic features (coastlines, rivers, parks)
            - Text labels and street names
            - Any visible coordinate grids or reference markers
            
            Return a JSON array of features with type, description, and confidence (0-1).`
          },
          {
            type: "image_url",
            image_url: {
              url: imageDataUrl
            }
          }
        ]
      }
    ],
    max_tokens: 2000
  });

  try {
    const content = response.choices[0]?.message?.content || '[]';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return [];
  }
};

export const suggestCoordinates = async (imageDataUrl: string): Promise<CoordinateSuggestion | null> => {
  if (!openai) {
    throw new Error('OpenAI not initialized. Please provide an API key.');
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this zoning map and try to determine its geographic location and bounds:
            - Look for any street names, landmark names, or location references
            - Identify any coordinate grids, lat/lng markings, or reference systems
            - Look for city/town names, zip codes, or other location indicators
            - Estimate the geographic area coverage
            
            Return a JSON object with suggested southwest and northeast coordinates (lat/lng), confidence level (0-1), and reasoning for your suggestion.
            Format: {
              "southwest": {"lat": number, "lng": number},
              "northeast": {"lat": number, "lng": number},
              "confidence": number,
              "reasoning": "explanation of how you determined these coordinates"
            }`
          },
          {
            type: "image_url",
            image_url: {
              url: imageDataUrl
            }
          }
        ]
      }
    ],
    max_tokens: 1000
  });

  try {
    const content = response.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Error parsing coordinate suggestion:', error);
    return null;
  }
};

export const detectZoningLegend = async (imageDataUrl: string): Promise<DetectedLegend> => {
  if (!openai) {
    throw new Error('OpenAI not initialized. Please provide an API key.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this zoning map image and detect the legend/key information:

              Look for:
              - Zone type names (e.g., "Residential", "Commercial", "Industrial")
              - Zone codes/abbreviations (e.g., "R1", "C2", "M1")
              - Color assignments for each zone type
              - Descriptions or definitions of zone types
              - Legend location on the map
              - Map scale information if visible

              Return a JSON object with this structure:
              {
                "zones": [
                  {
                    "id": "unique_id",
                    "name": "zone_name",
                    "code": "zone_code",
                    "color": "#hexcolor",
                    "description": "zone_description"
                  }
                ],
                "confidence": 0.95,
                "legendLocation": "top-right|bottom-left|etc",
                "mapScale": "1:2400|etc",
                "reasoning": "detailed explanation of detection process"
              }

              For colors, try to identify the actual hex colors used or provide close approximations.
              Confidence should reflect how certain you are about the detected legend information.`
            },
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl
              }
            }
          ]
        }
      ],
      max_tokens: 2000
    });

    const content = response.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      // Ensure zones have unique IDs
      if (result.zones) {
        result.zones = result.zones.map((zone: any, index: number) => ({
          ...zone,
          id: zone.id || `detected-${index + 1}-${Math.random().toString(36).substr(2, 6)}`
        }));
      }
      return result;
    }
    throw new Error('No valid JSON found in response');
  } catch (error: any) {
    console.error('Error in legend detection:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('insufficient_quota')) {
      throw new Error('OpenAI API quota exceeded. Please check your billing.');
    } else if (error.message?.includes('invalid_api_key')) {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    } else if (error.message?.includes('rate_limit')) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    } else if (error.message?.includes('model_not_found')) {
      throw new Error('OpenAI model not available. Please try again later.');
    } else {
      throw new Error(`AI legend detection failed: ${error.message || 'Unknown error'}`);
    }
  }
};

export const detectMapCropRegions = async (imageDataUrl: string): Promise<MapCropSuggestion> => {
  if (!openai) {
    throw new Error('OpenAI not initialized. Please provide an API key.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this zoning map image to identify separate regions for optimal cropping:

              I need to identify:
              1. THE MAIN MAP AREA - the geographic/spatial content showing zones, streets, boundaries
              2. THE LEGEND/KEY AREA - text and color boxes explaining zone types (if present as a separate section)

              Please examine the image and provide crop coordinates (x, y, width, height) as percentages (0-100) of the total image dimensions.

              Return a JSON object:
              {
                "mapRegion": {
                  "x": percentage_from_left,
                  "y": percentage_from_top, 
                  "width": percentage_width,
                  "height": percentage_height
                },
                "legendRegion": {
                  "x": percentage_from_left,
                  "y": percentage_from_top,
                  "width": percentage_width, 
                  "height": percentage_height
                } || null,
                "confidence": 0.95,
                "reasoning": "explanation of detected regions",
                "mapOnly": true/false
              }

              Rules:
              - mapRegion should contain the main geographic content
              - legendRegion should be null if legend is integrated within the map
              - Set mapOnly: true if no separate legend area exists
              - Coordinates are percentages (0-100) of image dimensions
              - Be conservative with boundaries to avoid cutting off content`
            },
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No valid JSON found in response');
  } catch (error: any) {
    console.error('Error in crop detection:', error);
    
    if (error.message?.includes('insufficient_quota')) {
      throw new Error('OpenAI API quota exceeded. Please check your billing.');
    } else if (error.message?.includes('invalid_api_key')) {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    } else if (error.message?.includes('rate_limit')) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    } else {
      throw new Error(`AI crop detection failed: ${error.message || 'Unknown error'}`);
    }
  }
};

export const calculateAlignment = async (
  overlayImageUrl: string,
  baseMapScreenshot: string
): Promise<AlignmentSuggestion | null> => {
  if (!openai) {
    throw new Error('OpenAI not initialized. Please provide an API key.');
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Compare these two map images to suggest optimal alignment parameters:
            
            Image 1: PDF overlay map
            Image 2: Base OpenStreetMap view
            
            Analyze matching features like roads, intersections, and landmarks to suggest:
            - Scale factor (0.1 to 3.0) - how much to resize the overlay
            - Rotation angle (-180 to 180 degrees)
            - Position offset (x, y in pixels)
            - Confidence level (0-1)
            
            Return JSON: {
              "scale": number,
              "rotation": number,
              "position": {"x": number, "y": number},
              "confidence": number,
              "reasoning": "explanation of alignment strategy"
            }`
          },
          {
            type: "image_url",
            image_url: {
              url: overlayImageUrl
            }
          },
          {
            type: "image_url",
            image_url: {
              url: baseMapScreenshot
            }
          }
        ]
      }
    ],
    max_tokens: 1000
  });

  try {
    const content = response.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Error parsing alignment suggestion:', error);
    return null;
  }
};