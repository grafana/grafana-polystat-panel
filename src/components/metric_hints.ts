import { FieldType } from '@grafana/data';

// builds unique metric names to shorten the list displayed
export const getMetricHints = (frames: any) => {
  let metricHints = new Set<string>();
  for (let i = 0; i < frames.length; i++) {
    // start with empty hint
    let hintValue = '';
    // the frame may have a name defined, start with it, fields will change it as needed
    if (frames[i]?.name) {
      hintValue = frames[i].name;
    }
    // iterate over fields, get all number types and provide as hints
    for (const aField of frames[i].fields) {
      if (aField.type === FieldType.number) {
        // update the hint to use the field Name if we didn't get a value from above
        if ((aField.name) && (hintValue === '')) {
          hintValue = aField.name;
        }
        // check for a label with __name__ and use it instead
        if (aField?.labels && ('__name__' in aField.labels)) {
          hintValue = aField.labels['__name__'];
          // append the rest of the labels
          const appendLabels: string[] = [];
          for (const aLabel in aField.labels) {
            if (aLabel !== '__name__') {
              appendLabels.push(`${aLabel}="${aField.labels[aLabel]}"`);
            }
          }
          if (appendLabels.length > 0) {
            // sort them first
            appendLabels.sort();
            hintValue += '{' + appendLabels.join('') + '}';
          }
        }
        // update the hint to use the displayNameFromDS value
        // (the query has a specified a naming convention)
        if (aField?.config && aField.config?.displayNameFromDS) {
          hintValue = aField.config?.displayNameFromDS;
        }
        metricHints.add(hintValue);
      }
    }
  }
  return metricHints;
}
