/*
  Generic module to provide gradient colors

  Based on https://codepen.io/anon/pen/wWxGkr

*/
import { colorManipulator } from '@grafana/data';

export function normalizeToHex(color: string): string {
  return colorManipulator.asHexString(color);
}

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
  for (let i = 0; i < 3; i++) {
    parts.values[i] = Math.round(parts.values[i] * factor);
  }
  return colorManipulator.asHexString(colorManipulator.recomposeColor(parts));
}
