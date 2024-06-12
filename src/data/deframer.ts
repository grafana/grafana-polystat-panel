import { DataFrame, Field, FieldType, FieldConfig, Vector } from '@grafana/data';

// Inserts a "Time" field into each dataframe if it is missing
// the value of the timestamp is "now"
// any field without a numeric type is considered a label
export function InsertTime(data: DataFrame[]): DataFrame[] {
  // TODO: time to insert can be taken from the first row if there are timeseries already
  // for now, just insert now
  const timeToInsert = Date.now();
  const newData: DataFrame[] = [];
  for (const frame of data) {
    const newFrame: DataFrame = {
      ...frame,
      meta: {...frame.meta},
      fields: [], // clear the fields
    };
    const hasTimestamp = frameHasTimestamp(frame);
    // rebuild a new frame with labels on the numerical fields
    for (const aField of frame.fields) {
      if (aField.type === FieldType.number) {
        if (!hasTimestamp) {
          const copiedField = Object.assign({}, aField);
          // need to get the number of rows of data for this frame
          const aFieldValues = copiedField.values.toArray();
          const rowsOfField = aFieldValues.length;
          for (let rowNum = 0; rowNum < rowsOfField; rowNum++) {
            // only create a new field when the rowValue is not null
            if (aFieldValues[rowNum] !== null) {
              if (aField.state) {
                copiedField.state = Object.assign({}, aField.state);
              }
              newFrame.fields.push({
                ...copiedField,
                labels: flattenLabels(frame, rowNum),
                values: [getValueOfField(copiedField, rowNum)] as any,
              });
            }
          }
        } else {
          // copy the object
          const copiedField = Object.assign({}, aField);
          if (aField.state) {
            copiedField.state = Object.assign({}, aField.state);
          }
          newFrame.fields.push(copiedField);
        }
      }
    }
    if (!hasTimestamp) {
      const fc: FieldConfig = {};
      const timeField: Field = {
        name: 'Time',
        type: FieldType.time,
        values: [timeToInsert] as any,
        config: fc,
      };
      // insert it
      newFrame.fields.push(timeField);
    } else {
      // time field already exists
      // copy all non-number fields from original frame
      for (const aField of frame.fields) {
        if (aField.type !== FieldType.number) {
          const copiedField = Object.assign({}, aField);
          if (aField.state) {
            copiedField.state = Object.assign({}, aField.state);
          }
          newFrame.fields.push(copiedField);
        }
      }
    }
    newData.push(newFrame);
  }

  return newData;
}

function frameHasTimestamp(frame: DataFrame): boolean {
  for (let j = 0; j < frame.fields.length; j++) {
    const aField = frame.fields[j];
    if (aField.type === FieldType.time) {
      return true;
    }
  }
  return false;
}

function flattenLabels(frame: DataFrame, rowNum: number) {
  let labelIndexes = [];
  const numFields = frame.fields.length;

  // first get the fields of type string
  for (let j = 0; j < numFields; j++) {
    if (frame.fields[j].type === FieldType.string) {
      labelIndexes.push(j);
    }
  }
  let labelWithValues = getLabelValues(frame, labelIndexes, rowNum);
  return labelWithValues;
}

function getValueOfField(field: Field, index: number) {
  const bufferValue = field.values.toArray()[index];
  return bufferValue;
}

function getLabelValues(frame: DataFrame, indexes: any[], rowNum: number) {
  let labelAndValue = {};
  for (let index = 0; index < indexes.length; index++) {
    let indexValue = indexes[index];
    let aField = frame.fields[indexValue];
    if (aField.type !== FieldType.number) {
      let value = getValueOfField(aField, rowNum);
      // TODO: fix this...
      // @ts-ignore
      labelAndValue[aField.name] = value;
    }
  }
  return labelAndValue;
}
