import { stringToJsRegex } from '@grafana/data';
import { CompositeDataModel } from './types';

export class ClickThroughTransformer {
  static cellName = /\${__cell_name}/;
  static cellValue = /\${__cell}/;
  static cellRawValue = /\${__cell:raw}/;

  static nthCellName = /\${__cell_name_(\d+)}/;
  static nthCellValue = /\${__cell_(\d+)}/;
  static nthCellRawValue = /\${__cell_(\d+):raw}/;

  static compositeNameRegex = /\${__composite_name}/;

  static transformSingleMetric(index: number, url: string, data: CompositeDataModel[]): string {
    if (isNaN(index)) {
      return url;
    }
    const item = data[index];
    while (url.match(this.cellName)) {
      url = url.replace(this.cellName, encodeURIComponent(item.name));
    }
    while (url.match(this.cellValue)) {
      url = url.replace(this.cellValue, encodeURIComponent(item.valueFormatted));
    }
    while (url.match(this.cellRawValue)) {
      url = url.replace(this.cellRawValue, encodeURIComponent(item.value.toString()));
    }
    return url;
  }

  static transformNthMetric(url: string, data: CompositeDataModel[]): string {
    while (url.match(this.nthCellName)) {
      const matched = url.match(this.nthCellName);
      if (matched && matched.length >= 2) {
        const captureIndex = Number(matched[1]);
        const nthName = data[captureIndex].name;
        url = url.replace(this.nthCellName, nthName);
      }
    }
    while (url.match(this.nthCellValue)) {
      const matched = url.match(this.nthCellValue);
      if (matched && matched.length >= 2) {
        const captureIndex = Number(matched[1]);
        const nthValue = data[captureIndex].valueFormatted;
        url = url.replace(this.nthCellValue, encodeURIComponent(nthValue));
      }
    }
    while (url.match(this.nthCellRawValue)) {
      const matched = url.match(this.nthCellRawValue);
      if (matched && matched.length >= 2) {
        const captureIndex = Number(matched[1]);
        const nthValue = data[captureIndex].value;
        url = url.replace(this.nthCellRawValue, nthValue.toString());
      }
    }
    return url;
  }

  static transformComposite(name: string, url: string): string {
    while (url.match(this.compositeNameRegex)) {
      url = url.replace(this.compositeNameRegex, name);
    }
    return url;
  }

  static transformByRegex(pattern: string, item: CompositeDataModel, url: string): string {
    const regex = stringToJsRegex(pattern);
    const matches = item.name.match(regex);
    if (matches && matches.length > 0) {
      matches.forEach((_, index) => {
        const value = matches[index];
        const matchType1 = `\$\{${index}\}`;
        url = url.replace(matchType1, value);
        const matchType2 = `\$${index}`;
        url = url.replace(matchType2, value);
      });
    }
    if (matches && matches.groups) {
      for (const key in matches.groups) {
        const value = matches.groups[key];
        const matchType1 = `\$\{${key}\}`;
        url = url.replace(matchType1, value);
        const matchType2 = `\$${key}`;
        url = url.replace(matchType2, value);
      }
    }
    return url;
  }
}
