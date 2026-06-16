/*
  Generic class to provide gradient colors

  Based on https://codepen.io/anon/pen/wWxGkr

*/
export class Color {
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  asHex() {
    return '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
  }

  asRGB() {
    return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
  }

  blendWith(col: Color, a: number) {
    const r = Math.round(col.r * (1 - a) + this.r * a);
    const g = Math.round(col.g * (1 - a) + this.g * a);
    const b = Math.round(col.b * (1 - a) + this.b * a);
    return new Color(r, g, b);
  }

  Mul(col: Color, a: number) {
    const r = Math.round((col.r / 255) * this.r * a);
    const g = Math.round((col.g / 255) * this.g * a);
    const b = Math.round((col.b / 255) * this.b * a);
    return new Color(r, g, b);
  }

  RGBToHex(rgb: any) {
    let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
    rgb = rgb.substr(4).split(')')[0].split(sep);
    // Convert %s to 0–255
    for (let R in rgb) {
      let r = rgb[R];
      if (r.indexOf('%') > -1) {
        rgb[R] = Math.round((r.substr(0, r.length - 1) / 100) * 255);
      }
    }
  }

  static RGBAToHex(orig: string) {
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

  fromHex(hex: string) {
    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    hex = hex.substring(1, 7);
    const bigint = parseInt(hex, 16);
    this.r = (bigint >> 16) & 255;
    this.g = (bigint >> 8) & 255;
    this.b = bigint & 255;
  }
}
