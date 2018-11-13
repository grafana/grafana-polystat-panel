declare function GetDecimalsForValue(value: any, panelDecimals: any): {
    decimals: any;
    scaledDecimals: any;
};
declare function getTextSizeForWidth(text: string, font: any, width: any, minFontPx: any, maxFontPx: any): any;
declare function getTextSizeForWidthAndHeight(text: string, font: any, width: number, height: number, minFontPx: number, maxFontPx: number): number;
declare function getTextWidth(text: string, font: string): number;
declare function RGBToHex(text: string): string;
export { GetDecimalsForValue, getTextSizeForWidth, getTextSizeForWidthAndHeight, getTextWidth, RGBToHex };
