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
    autoWidth: number;
    autoHeight: number;
    numColumns: number;
    numRows: number;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    constructor(templateSrv: any, svgContainer: any, d3DivId: any, opt: any);
    update(data: any): void;
    draw(): void;
    formatValueContent(i: any, frames: any, thisRef: any): string;
    getAutoHexRadius(): number;
    calculateSVGSize(): void;
    generatePoints(): any;
}
