import OpenAI from 'openai';

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

export const analyzeMapForFeatures = async (imageDataUrl: string): Promise<MapFeature[]> => {
  if (!openai) {
    throw new Error('OpenAI not initialized. Please provide an API key.');
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
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
    model: "gpt-4-vision-preview",
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

export const calculateAlignment = async (
  overlayImageUrl: string,
  baseMapScreenshot: string
): Promise<AlignmentSuggestion | null> => {
  if (!openai) {
    throw new Error('OpenAI not initialized. Please provide an API key.');
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
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