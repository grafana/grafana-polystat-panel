/**
 * Convert model data to url params
 */
import { stringToJsRegex } from '@grafana/data';
import { PolystatModel } from '../components/types';

const cellName = /\${__cell_name}/;
const cellValue = /\${__cell}/;
const cellRawValue = /\${__cell:raw}/;

const nthCellName = /\${__cell_name_(\d+)}/;
const nthCellValue = /\${__cell_(\d+)}/;
const nthCellRawValue = /\${__cell_(\d+):raw}/;

const compositeNameRegex = /\${__composite_name}/;

function transformSingleMetric(index: number, url: string, data: PolystatModel[]): string {
  if (isNaN(index)) {
    return url;
  }
  const item = data[index];
  // check if url contains any dereferencing
  while (url.match(cellName)) {
    // replace with series name
    url = url.replace(cellName, encodeURIComponent(item.name));
  }
  while (url.match(cellValue)) {
    // replace with formatted value, and encoded
    url = url.replace(cellValue, encodeURIComponent(item.valueFormatted));
  }
  while (url.match(cellRawValue)) {
    // replace with value
    url = url.replace(cellRawValue, encodeURIComponent(item.value.toString()));
  }
  return url;
}

function transformNthMetric(url: string, data: PolystatModel[]) {
  while (url.match(nthCellName)) {
    const matched = url.match(nthCellName);
    if (matched && matched.length >= 2) {
      // get the capture number
      const captureIndex = matched[1] as unknown as number;
      const nthName = data[captureIndex].name;
      // replace with series name
      url = url.replace(nthCellName, nthName);
    }
  }
  while (url.match(nthCellValue)) {
    const matched = url.match(nthCellValue);
    if (matched && matched.length >= 2) {
      // get the capture number
      const captureIndex = matched[1] as unknown as number;
      const nthValue = data[captureIndex].valueFormatted;
      // replace with formatted value encoded
      url = url.replace(nthCellValue, encodeURIComponent(nthValue));
    }
  }
  while (url.match(nthCellRawValue)) {
    const matched = url.match(nthCellRawValue);
    if (matched && matched.length >= 2) {
      // get the capture number
      const captureIndex = matched[1] as unknown as number;
      const nthValue = data[captureIndex].value;
      // replace with raw value
      url = url.replace(nthCellRawValue, nthValue.toString());
    }
  }
  return url;
}

function transformComposite(name: string, url: string) {
  // check if url contains any dereferencing
  while (url.match(compositeNameRegex)) {
    // replace with series name
    url = url.replace(compositeNameRegex, name);
  }
  return url;
}

function transformByRegex(pattern: string, item: PolystatModel, url: string) {
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

export const ClickThroughTransformer = {
  transformSingleMetric,
  transformNthMetric,
  transformComposite,
  transformByRegex,
};
