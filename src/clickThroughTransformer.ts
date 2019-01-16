/**
 * Convert model data to url params
 */
import {PolystatModel} from "./polystatmodel";

class ClickThroughTransformer {
  static cellName: RegExp = /\${__cell_name}/;
  static cellValue: RegExp = /\${__cell}/;
  static cellRawValue: RegExp = /\${__cell:raw}/;

  static nthCellName: RegExp = /\${__cell_name_(\d+)}/;
  static nthCellValue: RegExp = /\${__cell_(\d+)}/;
  static nthCellRawValue: RegExp = /\${__cell_(\d+):raw}/;

  static compositeName: RegExp = /\${__composite_name}/;

  static tranformSingleMetric(index: number, url: string, data: Array<PolystatModel>) {
    if (isNaN(index)) {
      return url;
    }
    let item = data[index];
    // check if url contains any dereferencing
    if (url.match(this.cellName)) {
      // replace with series name
      url = url.replace(this.cellName, item.name);
    }
    if (url.match(this.cellValue)) {
      // replace with formatted value, and encoded
      url = url.replace(this.cellValue, encodeURIComponent(item.valueFormatted));
    }
    if (url.match(this.cellRawValue)) {
      // replace with value
      url = url.replace(this.cellRawValue, item.value.toString());
    }
    return url;
  }

  static tranformNthMetric(url: string, data: Array<PolystatModel>) {
    while (url.match(this.nthCellName)) {
      let matched = url.match(this.nthCellName);
      //console.log("matched: " + matched);
      if (matched.length >= 2) {
        // get the capture number
        let captureIndex = matched[1];
        let nthName = data[captureIndex].name;
        // replace with series name
        url = url.replace(this.nthCellName, nthName);
      }
    }
    while (url.match(this.nthCellValue)) {
      let matched = url.match(this.nthCellValue);
      if (matched.length >= 2) {
        // get the capture number
        let captureIndex = matched[1];
        let nthValue = data[captureIndex].valueFormatted;
        // replace with formatted value encoded
        url = url.replace(this.nthCellValue, encodeURIComponent(nthValue));
      }
    }
    while (url.match(this.nthCellRawValue)) {
      let matched = url.match(this.nthCellRawValue);
      if (matched.length >= 2) {
        // get the capture number
        let captureIndex = matched[1];
        let nthValue = data[captureIndex].value;
        // replace with raw value
        url = url.replace(this.nthCellRawValue, nthValue.toString());
      }
    }
    return url;
  }

  static tranformComposite(name: string, url: string) {
    // check if url contains any dereferencing
    if (url.match(this.compositeName)) {
      // replace with series name
      url = url.replace(this.compositeName, name);
    }
    return url;
  }

}

export {
  ClickThroughTransformer
};
