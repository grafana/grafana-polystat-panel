import { ValueMapping } from '@grafana/data';
import { getMappedValue } from './v7/valueMappings';
import { getValueMappingResult } from './v8/valueMappings';

//
// To maintain compatibility back to Grafana >=v7.3, this wrapper is needed
// to process the value mappings based on the object passed in.
//
// the method `getMappedValue()` function was removed in v9
// the replacement `getValueMappingResult()` only appears in v8.1.0+
//
// At runtime, this cannot be determined so the legacy function and the new function are both provided
// here, to allow this to work work across all versions (7.3 > 9.x)
//
export const GetMappedValue = (valueMappings: any[], value: any): any => {
  let mappedValue = getMappedValue(valueMappings, value);
  if (typeof mappedValue === 'undefined') {
    return getValueMappingResult(valueMappings, value);
  }
  return mappedValue;
};

export const getMappings = (fieldConfigMappings: ValueMapping[] | undefined, dataMappings: ValueMapping[] | undefined) => {
  return fieldConfigMappings && fieldConfigMappings.length > 0 ? fieldConfigMappings : dataMappings;
}
