/*
  Generic module to provide gradient colors

  Based on https://codepen.io/anon/pen/wWxGkr

*/
import { colorManipulator } from '@grafana/data';

const HEX_CHANNEL_RE = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i;

/**
 * Normalizes any CSS color (hex, rgb, rgba) to a hex string.
 */
export function normalizeToHex(color: string): string {
  return colorManipulator.asHexString(color);
}

/**
 * Darkens a hex color by scaling each RGB channel by `factor` (0-1).
 */
export function darken(hex: string, factor: number): string {
  const match = HEX_CHANNEL_RE.exec(hex);
  if (!match) {
    return hex;
  }
  const [, rHex, gHex, bHex] = match;
  const r = Math.round(parseInt(rHex, 16) * factor);
  const g = Math.round(parseInt(gHex, 16) * factor);
  const b = Math.round(parseInt(bHex, 16) * factor);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
