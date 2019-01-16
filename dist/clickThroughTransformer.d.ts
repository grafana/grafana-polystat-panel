import { PolystatModel } from "./polystatmodel";
declare class ClickThroughTransformer {
    static cellName: RegExp;
    static cellValue: RegExp;
    static cellRawValue: RegExp;
    static nthCellName: RegExp;
    static nthCellValue: RegExp;
    static nthCellRawValue: RegExp;
    static compositeName: RegExp;
    static tranformSingleMetric(index: number, url: string, data: Array<PolystatModel>): string;
    static tranformNthMetric(url: string, data: Array<PolystatModel>): string;
    static tranformComposite(name: string, url: string): string;
}
export { ClickThroughTransformer };
