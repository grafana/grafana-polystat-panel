import { FieldType } from '@grafana/data';

export const getMetricHints = (frames: any) => {
  const metricHints = new Set<string>();
  for (let i = 0; i < frames.length; i++) {
    let hintValue = '';
    if (frames[i]?.name) {
      hintValue = frames[i].name;
    }
    for (const aField of frames[i].fields) {
      if (aField.type === FieldType.number) {
        if (aField.name && hintValue === '') {
          hintValue = aField.name;
        }
        if (aField?.labels && '__name__' in aField.labels) {
          hintValue = aField.labels.__name__;
          const appendLabels: string[] = [];
          for (const aLabel in aField.labels) {
            if (aLabel !== '__name__') {
              appendLabels.push(`${aLabel}="${aField.labels[aLabel]}"`);
            }
          }
          if (appendLabels.length > 0) {
            appendLabels.sort();
            hintValue += `{${appendLabels.join('')}}`;
          }
        }
        if (aField?.config && aField.config?.displayNameFromDS) {
          hintValue = aField.config.displayNameFromDS;
        }
        metricHints.add(hintValue);
        hintValue = '';
      }
    }
  }
  return metricHints;
};
