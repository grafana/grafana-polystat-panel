/*
  Generic module to provide gradient colors

  Based on https://codepen.io/anon/pen/wWxGkr

*/
export interface Color {
  r: number;
  g: number;
  b: number;
}

export function createColor(r: number, g: number, b: number): Color {
  return { r, g, b };
}

export function asHex(c: Color): string {
  return '#' + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1);
}

export function asRGB(c: Color): string {
  return 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
}

export function blendWith(c: Color, col: Color, a: number): Color {
  const r = Math.round(col.r * (1 - a) + c.r * a);
  const g = Math.round(col.g * (1 - a) + c.g * a);
  const b = Math.round(col.b * (1 - a) + c.b * a);
  return { r, g, b };
}

export function mul(c: Color, col: Color, a: number): Color {
  const r = Math.round((col.r / 255) * c.r * a);
  const g = Math.round((col.g / 255) * c.g * a);
  const b = Math.round((col.b / 255) * c.b * a);
  return { r, g, b };
}

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function fromHex(hex: string): Color {
  hex = hex.substring(1, 7);
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

export function rgbaToHex(orig: string): string {
  const rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
  const alpha = ((rgb && rgb[4]) || '').trim();
  let hex = rgb
    ? (parseInt(rgb[1], 10) | (1 << 8)).toString(16).slice(1) +
      (parseInt(rgb[2], 10) | (1 << 8)).toString(16).slice(1) +
      (parseInt(rgb[3], 10) | (1 << 8)).toString(16).slice(1)
    : orig;

  let a = '1';
  if (alpha !== '') {
    const alphaVal = parseFloat(alpha);
    // multiply before convert to HEX
    a = ((alphaVal * 255) | (1 << 8)).toString(16).slice(1);
  }
  return '#' + hex + a;
}
