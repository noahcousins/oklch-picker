export interface OklchColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0+)
  h: number; // Hue (0-360)
  alpha?: number; // Alpha (0-1)
}

export interface RgbColor {
  r: number; // Red (0-255)
  g: number; // Green (0-255)
  b: number; // Blue (0-255)
  alpha?: number; // Alpha (0-1)
}

// OKLCH regex pattern - fixed to handle all decimal formats
export const OKLCH_REGEX =
  /oklch\(\s*([0-9]*\.?[0-9]+(?:%)?)\s+([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+(?:deg)?)\s*(?:\/\s*([0-9]*\.?[0-9]+(?:%)?))?\s*\)/gi;

/**
 * Parse OKLCH string to OklchColor object
 */
export function parseOklch(oklchString: string): OklchColor | null {
  // Reset regex to ensure fresh parsing
  const regex = new RegExp(OKLCH_REGEX.source, "i");
  const match = regex.exec(oklchString.toLowerCase());

  if (!match) {
    return null;
  }

  let l = parseFloat(match[1]);
  if (match[1].includes("%")) {
    l = l / 100;
  }

  const c = parseFloat(match[2]);

  let h = parseFloat(match[3]);
  if (match[3].includes("deg")) {
    h = h; // Already in degrees
  }

  let alpha = 1;
  if (match[4]) {
    alpha = parseFloat(match[4]);
    if (match[4].includes("%")) {
      alpha = alpha / 100;
    }
  }

  return { l, c, h, alpha };
}

/**
 * Convert OKLCH to RGB
 * Based on the OKLCH color space specification
 */
export function oklchToRgb(oklch: OklchColor): RgbColor {
  const { l, c, h, alpha = 1 } = oklch;

  // Convert to OKLab first
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // Convert OKLab to linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  // Linear RGB
  let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Apply gamma correction (linear to sRGB)
  r = gammaCorrection(r);
  g = gammaCorrection(g);
  b_ = gammaCorrection(b_);

  // Clamp and convert to 0-255 range
  r = Math.max(0, Math.min(255, Math.round(r * 255)));
  g = Math.max(0, Math.min(255, Math.round(g * 255)));
  b_ = Math.max(0, Math.min(255, Math.round(b_ * 255)));

  return { r, g, b: b_, alpha };
}

/**
 * Convert RGB to OKLCH
 */
export function rgbToOklch(rgb: RgbColor): OklchColor {
  const { r, g, b, alpha = 1 } = rgb;

  // Convert to linear RGB (inverse gamma correction)
  const rLinear = inverseGammaCorrection(r / 255);
  const gLinear = inverseGammaCorrection(g / 255);
  const bLinear = inverseGammaCorrection(b / 255);

  // Convert linear RGB to OKLab
  const l =
    0.4122214708 * rLinear + 0.5363325363 * gLinear + 0.0514459929 * bLinear;
  const m =
    0.2119034982 * rLinear + 0.6806995451 * gLinear + 0.1073969566 * bLinear;
  const s =
    0.0883024619 * rLinear + 0.2817188376 * gLinear + 0.6299787005 * bLinear;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // Convert to OKLCH
  const C = Math.sqrt(a * a + b_ * b_);
  let H = (Math.atan2(b_, a) * 180) / Math.PI;
  if (H < 0) {
    H += 360;
  }

  return { l: L, c: C, h: H, alpha };
}

/**
 * Apply gamma correction (linear to sRGB)
 */
function gammaCorrection(linear: number): number {
  if (linear <= 0.0031308) {
    return 12.92 * linear;
  } else {
    return 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
  }
}

/**
 * Apply inverse gamma correction (sRGB to linear)
 */
function inverseGammaCorrection(srgb: number): number {
  if (srgb <= 0.04045) {
    return srgb / 12.92;
  } else {
    return Math.pow((srgb + 0.055) / 1.055, 2.4);
  }
}

/**
 * Format OKLCH color as string
 */
export function formatOklch(oklch: OklchColor): string {
  const { l, c, h, alpha = 1 } = oklch;
  if (alpha < 1) {
    return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(
      1
    )} / ${alpha.toFixed(2)})`;
  }
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
}
