/*
  Generic module to provide gradient colors

  Based on https://codepen.io/anon/pen/wWxGkr

*/
import { colorManipulator } from '@grafana/data';

/**
 * Scales each RGB channel by factor, rounding to nearest. Not colorManipulator.darken(),
 * which truncates and shifts every channel by 1 (#299c46 becomes #1c6d31, not #1d6d31).
 * Alpha is carried through untouched.
 */
export function darken(hex: string, factor: number): string {
  let parts;
  try {
    parts = colorManipulator.decomposeColor(hex);
  } catch {
    return hex;
  }
  if (!parts.type.startsWith('rgb')) {
    return hex;
  }
  for (let i = 0; i < 3; i++) {
    parts.values[i] = Math.round(parts.values[i] * factor);
  }
  return colorManipulator.asHexString(colorManipulator.recomposeColor(parts));
}
