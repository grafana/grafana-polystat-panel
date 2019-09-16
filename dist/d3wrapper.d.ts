export declare class D3Wrapper {
    svgContainer: any;
    d3DivId: any;
    maxColumnsUsed: number;
    maxRowsUsed: number;
    opt: any;
    data: any;
    templateSrv: any;
    calculatedPoints: any;
    hexRadius: number;
    autoHexRadius: number;
    numColumns: number;
    numRows: number;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    minFont: number;
    maxFont: number;
    purelight: any;
    constructor(templateSrv: any, svgContainer: any, d3DivId: any, opt: any);
    computeTextFontSize(text: string, linesToDisplay: number, textAreaWidth: number, textAreaHeight: number): number;
    update(data: any): void;
    draw(): void;
    formatValueContent(i: any, frames: any, thisRef: any): string;
    buildTriggerCache(item: any): any[];
    getAutoHexRadius(): number;
    generatePoints(): any;
}
