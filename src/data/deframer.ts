import { DataFrame, Field, FieldType, ArrayVector, Labels } from '@grafana/data';
import _ from 'lodash';


// Inserts a "Time" field into each dataframe if it is missing
// the value of the timestamp is "now"
// any field without a numeric type is considered a label
export function InsertTime(data: DataFrame[]): DataFrame[] {
  // TODO: time to insert can be taken from the first row if there are timeseries already
  // for now, just insert now
  const timeToInsert = Date.now();
  const newData: DataFrame[] = [];
  for (let i = 0; i < data.length; i++) {
    const frame = data[i];
    //const flattened = this.flattenLabels(frame, 0);
    const newFrame = _.cloneDeep(frame);
    // clear the fields
    newFrame.fields = [];
    //const labels = this.getLabelsOfFrame(frame);
    const hasTimestamp = frameHasTimestamp(frame);
    // rebuild a new frame with labels on the numerical fields
    const numFields = frame.fields.length;
    for (let j = 0; j < numFields; j++) {
      const aField = frame.fields[j];
      if (aField.type === FieldType.number) {
        // need to get the number of rows of data for this frame
        const rowsOfField = aField.values.toArray().length;
        if (!hasTimestamp) {
          for (let rowNum = 0; rowNum < rowsOfField; rowNum++) {
            // only create a new field when the rowValue is not null
            if (aField.values.toArray()[rowNum] !== null) {
              // this has a nonnull value
              const flattened = flattenLabels(frame, rowNum);
              const newField = newFieldWithLabels(aField, flattened);
              const newFieldValues = new ArrayVector();
              const value = getValueOfField(aField, rowNum);
              newFieldValues.add(value);
              newField.values = newFieldValues;
              newFrame.fields.push(newField);
            }
          }
        } else {
          // copy the object
          const copiedField = Object.assign({}, aField);
          newFrame.fields.push(copiedField);
        }
      }
    }
    if (!hasTimestamp) {
      const z = new ArrayVector();
      z.add(timeToInsert);

      const timeField: Field = {
        name: 'Time',
        type: FieldType.time,
        values: z,
        config: null,
      };
      // insert it
      newFrame.fields.push(timeField);
    } else {
      // time field already exists
      // copy all non-number fields from original frame
      for (let j = 0; j < frame.fields.length; j++) {
        const aField = frame.fields[j];
        if (aField.type !== FieldType.number) {
          newFrame.fields.push(aField);
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

function newFieldWithLabels(field: Field, labels: Labels): Field {
  const newField = _.cloneDeep(field);
  newField.labels = labels;
  return newField;
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
      labelAndValue[aField.name] = value;
    }
  }
  return labelAndValue;
}
