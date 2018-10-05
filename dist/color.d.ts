export declare class Color {
    r: number;
    g: number;
    b: number;
    constructor(r: number, g: number, b: number);
    asHex(): string;
    asRGB(): string;
    blendWith(col: any, a: any): Color;
    Mul(col: any, a: any): Color;
    fromHex(hex: any): void;
    static createGradients(data: any): any;
}
