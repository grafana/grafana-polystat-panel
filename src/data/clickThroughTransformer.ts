/**
 * Convert model data to url params
 */
import { stringToJsRegex } from '@grafana/data';
import { PolystatModel } from '../components/types';

class ClickThroughTransformer {
  static cellName = /\${__cell_name}/;
  static cellValue = /\${__cell}/;
  static cellRawValue = /\${__cell:raw}/;

  static nthCellName = /\${__cell_name_(\d+)}/;
  static nthCellValue = /\${__cell_(\d+)}/;
  static nthCellRawValue = /\${__cell_(\d+):raw}/;

  static compositeNameRegex = /\${__composite_name}/;

  static transformSingleMetric(index: number, url: string, data: PolystatModel[]): string {
    if (isNaN(index)) {
      return url;
    }
    const item = data[index];
    // check if url contains any dereferencing
    while (url.match(this.cellName)) {
      // replace with series name
      url = url.replace(this.cellName, encodeURIComponent(item.name));
    }
    while (url.match(this.cellValue)) {
      // replace with formatted value, and encoded
      url = url.replace(this.cellValue, encodeURIComponent(item.valueFormatted));
    }
    while (url.match(this.cellRawValue)) {
      // replace with value
      url = url.replace(this.cellRawValue, encodeURIComponent(item.value.toString()));
    }
    return url;
  }

  static transformNthMetric(url: string, data: PolystatModel[]) {
    while (url.match(this.nthCellName)) {
      const matched = url.match(this.nthCellName);
      if (matched && matched.length >= 2) {
        // get the capture number
        const captureIndex = matched[1] as unknown as number;
        const nthName = data[captureIndex].name;
        // replace with series name
        url = url.replace(this.nthCellName, nthName);
      }
    }
    while (url.match(this.nthCellValue)) {
      const matched = url.match(this.nthCellValue);
      if (matched && matched.length >= 2) {
        // get the capture number
        const captureIndex = matched[1] as unknown as number;
        const nthValue = data[captureIndex].valueFormatted;
        // replace with formatted value encoded
        url = url.replace(this.nthCellValue, encodeURIComponent(nthValue));
      }
    }
    while (url.match(this.nthCellRawValue)) {
      const matched = url.match(this.nthCellRawValue);
      if (matched && matched.length >= 2) {
        // get the capture number
        const captureIndex = matched[1] as unknown as number;
        const nthValue = data[captureIndex].value;
        // replace with raw value
        url = url.replace(this.nthCellRawValue, nthValue.toString());
      }
    }
    return url;
  }

  static transformComposite(name: string, url: string) {
    // check if url contains any dereferencing
    while (url.match(this.compositeNameRegex)) {
      // replace with series name
      url = url.replace(this.compositeNameRegex, name);
    }
    return url;
  }

  static transformByRegex(pattern: string, item: PolystatModel, url: string) {
    // detect regex capture groups from override.metricName and replace any occurrences in the click-through
    const regex = stringToJsRegex(pattern);
    const matches = item.name.match(regex);
    if (matches && matches.length > 0) {
      matches.forEach((aMatch, index) => {
        const value = matches[index];
        // console.log(`a match ${aMatch} index ${index} value ${value}`);
        const matchType1 = `\$\{${index}\}`;
        url = url.replace(matchType1, value);
        const matchType2 = `\$${index}`;
        url = url.replace(matchType2, value);
      });
    }
    if (matches && matches.groups) {
      for (const key in matches.groups) {
        const value = matches.groups[key];
        // console.log(`key = ${key} value = ${value}`);
        // support $CAPTURE and ${CAPTURE}
        const matchType1 = `\$\{${key}\}`;
        url = url.replace(matchType1, value);
        const matchType2 = `\$${key}`;
        url = url.replace(matchType2, value);
      }
    }
    return url;
  }
}

export { ClickThroughTransformer };
