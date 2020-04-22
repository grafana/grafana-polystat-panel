/**
 * Convert model data to url params
 */
import { PolystatModel } from './polystatmodel';

class ClickThroughTransformer {
  static cellName = /\${__cell_name}/;
  static cellValue = /\${__cell}/;
  static cellRawValue = /\${__cell:raw}/;

  static nthCellName = /\${__cell_name_(\d+)}/;
  static nthCellValue = /\${__cell_(\d+)}/;
  static nthCellRawValue = /\${__cell_(\d+):raw}/;

  static compositeName = /\${__composite_name}/;

  static tranformSingleMetric(index: number, url: string, data: PolystatModel[]): string {
    if (isNaN(index)) {
      return url;
    }
    const item = data[index];
    // check if url contains any dereferencing
    while (url.match(this.cellName)) {
      // replace with series name
      url = url.replace(this.cellName, item.name);
    }
    while (url.match(this.cellValue)) {
      // replace with formatted value, and encoded
      url = url.replace(this.cellValue, encodeURIComponent(item.valueFormatted));
    }
    while (url.match(this.cellRawValue)) {
      // replace with value
      url = url.replace(this.cellRawValue, item.value.toString());
    }
    return url;
  }

  static tranformNthMetric(url: string, data: PolystatModel[]) {
    while (url.match(this.nthCellName)) {
      const matched = url.match(this.nthCellName);
      if (matched.length >= 2) {
        // get the capture number
        const captureIndex = matched[1];
        const nthName = data[captureIndex].name;
        // replace with series name
        url = url.replace(this.nthCellName, nthName);
      }
    }
    while (url.match(this.nthCellValue)) {
      const matched = url.match(this.nthCellValue);
      if (matched.length >= 2) {
        // get the capture number
        const captureIndex = matched[1];
        const nthValue = data[captureIndex].valueFormatted;
        // replace with formatted value encoded
        url = url.replace(this.nthCellValue, encodeURIComponent(nthValue));
      }
    }
    while (url.match(this.nthCellRawValue)) {
      const matched = url.match(this.nthCellRawValue);
      if (matched.length >= 2) {
        // get the capture number
        const captureIndex = matched[1];
        const nthValue = data[captureIndex].value;
        // replace with raw value
        url = url.replace(this.nthCellRawValue, nthValue.toString());
      }
    }
    return url;
  }

  static tranformComposite(name: string, url: string) {
    // check if url contains any dereferencing
    while (url.match(this.compositeName)) {
      // replace with series name
      url = url.replace(this.compositeName, name);
    }
    return url;
  }
}

export { ClickThroughTransformer };
