import QRCode from 'qrcode';

export interface QRMatrixResult {
  matrix: boolean[][];
  size: number;
  moduleCount: number;
  partsCounts: {
    foreground: number;
    background: number;
    total: number;
  };
  physicalSize: {
    cm: number;
    inches: number;
  };
  isValid: boolean;
  warning?: string;
}

const BASEPLATE_SIZE = 32;
const BRICK_SIZE_CM = 0.8; // 1x1 brick is 8mm

export async function generateQRMatrix(content: string): Promise<QRMatrixResult> {
  if (!content || content.trim().length === 0) {
    return {
      matrix: [],
      size: 0,
      moduleCount: 0,
      partsCounts: { foreground: 0, background: 0, total: 0 },
      physicalSize: { cm: 0, inches: 0 },
      isValid: false,
      warning: 'Enter content to generate QR code'
    };
  }

  try {
    // Generate QR code data
    const qrData = await QRCode.create(content, {
      errorCorrectionLevel: 'M',
    });

    const moduleCount = qrData.modules.size;
    const modules = qrData.modules.data;

    // Check if QR is too complex for baseplate
    if (moduleCount > BASEPLATE_SIZE - 2) {
      return {
        matrix: [],
        size: moduleCount,
        moduleCount,
        partsCounts: { foreground: 0, background: 0, total: 0 },
        physicalSize: { cm: 0, inches: 0 },
        isValid: false,
        warning: `QR code too complex (${moduleCount}×${moduleCount}). Try a shorter URL or use a link shortener.`
      };
    }

    // Create centered matrix on baseplate
    const offset = Math.floor((BASEPLATE_SIZE - moduleCount) / 2);
    const matrix: boolean[][] = Array(BASEPLATE_SIZE)
      .fill(null)
      .map(() => Array(BASEPLATE_SIZE).fill(false));

    let foregroundCount = 0;
    let backgroundCount = BASEPLATE_SIZE * BASEPLATE_SIZE;

    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        const index = row * moduleCount + col;
        const isBlack = modules[index] === 1;
        matrix[row + offset][col + offset] = isBlack;
        if (isBlack) {
          foregroundCount++;
          backgroundCount--;
        }
      }
    }

    const physicalSizeCm = BASEPLATE_SIZE * BRICK_SIZE_CM;

    return {
      matrix,
      size: BASEPLATE_SIZE,
      moduleCount,
      partsCounts: {
        foreground: foregroundCount,
        background: backgroundCount,
        total: BASEPLATE_SIZE * BASEPLATE_SIZE
      },
      physicalSize: {
        cm: physicalSizeCm,
        inches: physicalSizeCm / 2.54
      },
      isValid: true
    };
  } catch (error) {
    return {
      matrix: [],
      size: 0,
      moduleCount: 0,
      partsCounts: { foreground: 0, background: 0, total: 0 },
      physicalSize: { cm: 0, inches: 0 },
      isValid: false,
      warning: 'Failed to generate QR code'
    };
  }
}

// Brick color palette based on real brick colors
export const BRICK_COLORS = [
  { id: 'black', name: 'Black', hex: '#1B1B1B' },
  { id: 'white', name: 'White', hex: '#F4F4F4' },
  { id: 'red', name: 'Red', hex: '#B40000' },
  { id: 'blue', name: 'Blue', hex: '#0055BF' },
  { id: 'yellow', name: 'Yellow', hex: '#FAC80A' },
  { id: 'green', name: 'Green', hex: '#237841' },
  { id: 'orange', name: 'Orange', hex: '#FE8A18' },
  { id: 'tan', name: 'Tan', hex: '#D9BB7A' },
  { id: 'dark-gray', name: 'Dark Gray', hex: '#595D60' },
  { id: 'light-gray', name: 'Light Gray', hex: '#9BA19D' },
  { id: 'dark-blue', name: 'Dark Blue', hex: '#0A3463' },
  { id: 'dark-green', name: 'Dark Green', hex: '#184632' },
  { id: 'pink', name: 'Pink', hex: '#FC97AC' },
  { id: 'lavender', name: 'Lavender', hex: '#A06EB9' },
] as const;

export type BrickColorId = typeof BRICK_COLORS[number]['id'];

export type BrickStyle = '3d' | 'inverse' | 'flat' | 'studs';

export function getBrickColor(id: BrickColorId): string {
  return BRICK_COLORS.find(c => c.id === id)?.hex || '#1B1B1B';
}
