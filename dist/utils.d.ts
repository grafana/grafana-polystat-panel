declare function GetDecimalsForValue(value: any, panelDecimals: any): {
    decimals;
    scaledDecimals;
};
declare function getTextSizeForWidth(text: string, font: any, width: any, minFontPx: any, maxFontPx: any): any;
declare function getTextWidth(text: string, font: string): number;
export { GetDecimalsForValue, getTextSizeForWidth, getTextWidth };
