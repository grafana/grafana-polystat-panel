import { stringToJsRegex } from '@grafana/data';
import { CompositeDataModel } from './types';

export const ApplyGlobalRegexPattern = (data: CompositeDataModel[], regexPattern: string): CompositeDataModel[] => {
  for (let i = 0; i < data.length; i++) {
    if (regexPattern !== '') {
      const regexVal = stringToJsRegex(regexPattern);
      if (data[i].name && regexVal.test(data[i].name.toString())) {
        const temp = regexVal.exec(data[i].name.toString());
        if (!temp) {
          continue;
        }
        let extractedTxt = '';
        if (temp.length > 1) {
          temp.slice(1).forEach((value) => {
            if (value) {
              extractedTxt += extractedTxt.length > 0 ? ` ${value.toString()}` : value.toString();
            }
          });
          data[i].displayName = extractedTxt;
        }
      }
    }
  }
  return data;
};
