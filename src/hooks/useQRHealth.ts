/**
 * QR Health Hook
 * Calculates QR code scannability based on contrast and density
 * Using principles from Constrained Optimization (Chapter 10)
 */

/**
 * Calculate relative luminance of a color (WCAG formula)
 */
function getLuminance(hex: string): number {
  // Convert hex to RGB
  const rgb = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!rgb) return 0;

  const [, r, g, b] = rgb;
  const [rNorm, gNorm, bNorm] = [
    parseInt(r, 16) / 255,
    parseInt(g, 16) / 255,
    parseInt(b, 16) / 255,
  ];

  // Apply sRGB gamma correction
  const rsRGB = rNorm <= 0.03928 ? rNorm / 12.92 : Math.pow((rNorm + 0.055) / 1.055, 2.4);
  const gsRGB = gNorm <= 0.03928 ? gNorm / 12.92 : Math.pow((gNorm + 0.055) / 1.055, 2.4);
  const bsRGB = bNorm <= 0.03928 ? bNorm / 12.92 : Math.pow((bNorm + 0.055) / 1.055, 2.4);

  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
}

/**
 * Calculate WCAG contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Estimate QR code density based on URL length and error correction
 */
function estimateDensity(urlLength: number, errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'): number {
  // QR version capacity (approximate)
  const capacities = {
    L: 2953, // Low (7%)
    M: 2331, // Medium (15%)
    Q: 1663, // Quartile (25%)
    H: 1273, // High (30%)
  };

  const capacity = capacities[errorCorrectionLevel];
  const dataBytes = urlLength * 8; // Approximate bits needed
  
  // Density = percentage of capacity used
  return Math.min(100, (dataBytes / capacity) * 100);
}

export interface QRHealthMetrics {
  contrastScore: number; // 0-100
  contrastRatio: number; // Actual WCAG ratio
  densityScore: number; // 0-100
  densityPercent: number; // Percentage of capacity
  overallHealth: number; // 0-100
  status: 'perfect' | 'good' | 'risky' | 'unscannable';
  warnings: string[];
  recommendations: string[];
}

export function useQRHealth() {
  const calculateHealth = (
    fgColor: string,
    bgColor: string,
    url: string,
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'M'
  ): QRHealthMetrics => {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // 1. Contrast Analysis
    const contrastRatio = getContrastRatio(fgColor, bgColor);
    let contrastScore = 0;

    if (contrastRatio >= 7) {
      contrastScore = 100; // AAA standard
    } else if (contrastRatio >= 4.5) {
      contrastScore = 85; // AA standard
    } else if (contrastRatio >= 3) {
      contrastScore = 60; // Acceptable
      warnings.push('Low contrast - may fail in poor lighting');
      recommendations.push('Increase color contrast for better scannability');
    } else {
      contrastScore = 30; // Poor
      warnings.push('Contrast too low - high risk of scan failure');
      recommendations.push('Use darker foreground or lighter background');
    }

    // 2. Density Analysis
    const densityPercent = estimateDensity(url.length, errorCorrectionLevel);
    let densityScore = 0;

    if (densityPercent < 50) {
      densityScore = 100; // Low density = reliable
    } else if (densityPercent < 70) {
      densityScore = 80; // Medium density
    } else if (densityPercent < 85) {
      densityScore = 60; // High density
      warnings.push('High dot density - may be hard to scan');
      recommendations.push(`Shorten URL or use Error Correction Level 'L'`);
    } else {
      densityScore = 30; // Very high density
      warnings.push('Extremely dense QR code - scan failure likely');
      recommendations.push('URL too long - consider shortening significantly');
    }

    // 3. Overall Health Score (weighted average)
    const overallHealth = Math.round(contrastScore * 0.7 + densityScore * 0.3);

    // 4. Status Classification
    let status: QRHealthMetrics['status'];
    if (overallHealth >= 90) status = 'perfect';
    else if (overallHealth >= 70) status = 'good';
    else if (overallHealth >= 50) status = 'risky';
    else status = 'unscannable';

    return {
      contrastScore: Math.round(contrastScore),
      contrastRatio: Math.round(contrastRatio * 100) / 100,
      densityScore: Math.round(densityScore),
      densityPercent: Math.round(densityPercent),
      overallHealth,
      status,
      warnings,
      recommendations,
    };
  };

  /**
   * Auto-fix contrast by adjusting foreground color
   * Keeps hue, adjusts lightness iteratively until contrast >= 4.5
   */
  const autoFixContrast = (fgColor: string, bgColor: string): string => {
    const targetRatio = 4.5;
    let currentFg = fgColor;
    let iterations = 0;
    const maxIterations = 20;

    while (iterations < maxIterations) {
      const ratio = getContrastRatio(currentFg, bgColor);
      if (ratio >= targetRatio) break;

      // Darken foreground by 5% each iteration
      const rgb = currentFg.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      if (!rgb) break;

      const [, r, g, b] = rgb;
      const newR = Math.max(0, parseInt(r, 16) - 13);
      const newG = Math.max(0, parseInt(g, 16) - 13);
      const newB = Math.max(0, parseInt(b, 16) - 13);

      currentFg = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
      iterations++;
    }

    return currentFg;
  };

  return { calculateHealth, autoFixContrast };
}
