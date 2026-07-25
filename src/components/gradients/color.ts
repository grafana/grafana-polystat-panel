/*
  Generic module to provide gradient colors

  Based on https://codepen.io/anon/pen/wWxGkr

*/
import { colorManipulator } from '@grafana/data';

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
  let parts;
  try {
    parts = colorManipulator.decomposeColor(hex);
  } catch {
    return hex;
  }
  if (parts.type.indexOf('rgb') === -1) {
    return hex;
  }
  const values = parts.values.map((value: number, index: number) => (index < 3 ? Math.round(value * factor) : value));
  return colorManipulator.asHexString(colorManipulator.recomposeColor({ ...parts, values }));
}
