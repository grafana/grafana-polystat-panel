import { FieldType } from '@grafana/data';

// builds unique metric names to shorten the list displayed
export const getMetricHints = (frames: any) => {
  let metricHints = new Set<string>();
  for (let i = 0; i < frames.length; i++) {
    let hintValue;
    // the frame may have a name defined, start with it, fields will change it as needed
    if (frames[i]?.name) {
      hintValue = frames[i].name;
    }
    // iterate over fields, get all number types and provide as hints
    for (const aField of frames[i].fields) {
      if (aField.type === FieldType.number) {
        // update the hint to use the field Name
        if (aField.name) {
          hintValue = aField.name;
        }
        // update the hint to use the displayNameFromDS value
        if (aField?.config && aField.config?.displayNameFromDS) {
          hintValue = aField.config?.displayNameFromDS;
        }
        // lastly check for a label with __name__ and use it instead
        if (aField?.labels && ('__name__' in aField.labels)) {
          hintValue = aField.labels['__name__'];
        }
        metricHints.add(hintValue);
      }
    }
  }
  return metricHints;
}
