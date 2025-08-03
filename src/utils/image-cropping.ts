import type { CropRegion } from '@/services/ai-vision';

/**
 * Crop an image based on percentage coordinates
 */
export const cropImageFromDataUrl = (
  imageDataUrl: string,
  cropRegion: CropRegion
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Create canvas for cropping
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Calculate actual pixel coordinates from percentages
        const actualX = (cropRegion.x / 100) * img.width;
        const actualY = (cropRegion.y / 100) * img.height;
        const actualWidth = (cropRegion.width / 100) * img.width;
        const actualHeight = (cropRegion.height / 100) * img.height;
        
        // Set canvas size to crop dimensions
        canvas.width = actualWidth;
        canvas.height = actualHeight;
        
        // Draw cropped portion of image
        ctx.drawImage(
          img,
          actualX, actualY, actualWidth, actualHeight, // source rectangle
          0, 0, actualWidth, actualHeight // destination rectangle
        );
        
        // Convert to data URL
        const croppedDataUrl = canvas.toDataURL('image/png', 0.9);
        resolve(croppedDataUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for cropping'));
    };
    
    img.src = imageDataUrl;
  });
};

/**
 * Resize an image to fit within maximum dimensions while maintaining aspect ratio
 */
export const resizeImageDataUrl = (
  imageDataUrl: string,
  maxWidth: number,
  maxHeight: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL
        const resizedDataUrl = canvas.toDataURL('image/png', 0.9);
        resolve(resizedDataUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for resizing'));
    };
    
    img.src = imageDataUrl;
  });
};

/**
 * Get image dimensions from data URL
 */
export const getImageDimensions = (imageDataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image to get dimensions'));
    };
    img.src = imageDataUrl;
  });
};

/**
 * Create a preview overlay showing crop regions
 */
export const createCropPreview = (
  imageDataUrl: string,
  mapRegion: CropRegion,
  legendRegion: CropRegion | null
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Add semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Clear map region
        const mapX = (mapRegion.x / 100) * img.width;
        const mapY = (mapRegion.y / 100) * img.height;
        const mapWidth = (mapRegion.width / 100) * img.width;
        const mapHeight = (mapRegion.height / 100) * img.height;
        
        ctx.clearRect(mapX, mapY, mapWidth, mapHeight);
        ctx.drawImage(img, mapX, mapY, mapWidth, mapHeight, mapX, mapY, mapWidth, mapHeight);
        
        // Add map region border
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.strokeRect(mapX, mapY, mapWidth, mapHeight);
        
        // Add map label
        ctx.fillStyle = '#10b981';
        ctx.font = '16px Arial';
        ctx.fillText('MAP', mapX + 5, mapY + 20);
        
        // Clear legend region if it exists
        if (legendRegion) {
          const legendX = (legendRegion.x / 100) * img.width;
          const legendY = (legendRegion.y / 100) * img.height;
          const legendWidth = (legendRegion.width / 100) * img.width;
          const legendHeight = (legendRegion.height / 100) * img.height;
          
          ctx.clearRect(legendX, legendY, legendWidth, legendHeight);
          ctx.drawImage(img, legendX, legendY, legendWidth, legendHeight, legendX, legendY, legendWidth, legendHeight);
          
          // Add legend region border
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);
          
          // Add legend label
          ctx.fillStyle = '#3b82f6';
          ctx.font = '16px Arial';
          ctx.fillText('LEGEND', legendX + 5, legendY + 20);
        }
        
        const previewDataUrl = canvas.toDataURL('image/png', 0.9);
        resolve(previewDataUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for preview'));
    };
    
    img.src = imageDataUrl;
  });
};