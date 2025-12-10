import ColorThief from 'colorthief';

/**
 * Converts RGB array to hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Loads an image file into an HTMLImageElement
 */
function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Extracts the dominant colors from an image file
 * @param imageFile - The image file to extract colors from
 * @param colorCount - Number of colors to extract (default: 3)
 * @returns Array of hex color strings
 */
export async function extractDominantColors(
  imageFile: File, 
  colorCount: number = 3
): Promise<string[]> {
  try {
    const img = await loadImageElement(imageFile);
    const colorThief = new ColorThief();
    
    // Get palette of colors
    const palette = colorThief.getPalette(img, colorCount);
    
    // Convert RGB arrays to hex strings
    return palette.map(([r, g, b]: [number, number, number]) => rgbToHex(r, g, b));
  } catch (error) {
    console.error('Color extraction failed:', error);
    throw new Error('Failed to extract colors from image');
  }
}

/**
 * Gets the single dominant color from an image
 */
export async function getDominantColor(imageFile: File): Promise<string> {
  try {
    const img = await loadImageElement(imageFile);
    const colorThief = new ColorThief();
    const [r, g, b] = colorThief.getColor(img);
    return rgbToHex(r, g, b);
  } catch (error) {
    console.error('Color extraction failed:', error);
    throw new Error('Failed to extract dominant color');
  }
}

/**
 * Determines if a color is light or dark
 */
export function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

/**
 * Sorts colors by luminance (lightest first)
 */
export function sortColorsByLuminance(colors: string[]): string[] {
  return [...colors].sort((a, b) => {
    const getLuminance = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return 0.299 * r + 0.587 * g + 0.114 * b;
    };
    return getLuminance(b) - getLuminance(a);
  });
}
