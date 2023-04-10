import { FieldType } from '@grafana/data';

// builds unique metric names to shorten the list displayed
export const getMetricHints = (frames: any) => {
  let metricHints = new Set<string>();
  for (let i = 0; i < frames.length; i++) {
    // iterate over fields, get all number types and provide as hints
    for (const aField of frames[i].fields) {
      if (aField.type === FieldType.number) {
        let hintValue = aField.name;
        if (aField?.labels && ('__name__' in aField.labels)) {
          hintValue = aField.labels['__name__'];
        }
        metricHints.add(hintValue);
      }
    }
  }
  return metricHints;
}
