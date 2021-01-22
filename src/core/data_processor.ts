// from grafana core
import _ from 'lodash';
import { colors } from '@grafana/ui';
import {
  TimeRange,
  FieldType,
  Field,
  DataFrame,
  getTimeField,
  getFieldDisplayName,
  getColorForTheme,
} from '@grafana/data';
import TimeSeries from 'grafana/app/core/time_series2';
import config from 'grafana/app/core/config';

type Options = {
  dataList: DataFrame[];
  range?: TimeRange;
};

export class DataProcessor {
  constructor(private panel: any) {}

  getSeriesList(options: Options): TimeSeries[] {
    const list: TimeSeries[] = [];
    const { dataList, range } = options;

    if (!dataList || !dataList.length) {
      return list;
    }

    for (let i = 0; i < dataList.length; i++) {
      const series = dataList[i];
      const { timeField } = getTimeField(series);

      if (!timeField) {
        continue;
      }

      for (let j = 0; j < series.fields.length; j++) {
        const field = series.fields[j];

        if (field.type !== FieldType.number) {
          continue;
        }
        const name = getFieldDisplayName(field, series, dataList);
        const datapoints = [];

        for (let r = 0; r < series.length; r++) {
          datapoints.push([field.values.get(r), timeField.values.get(r)]);
        }

        list.push(this.toTimeSeries(field, name, i, j, datapoints, list.length, range));
      }
    }

    // Merge all the rows if we want to show a histogram
    if (this.panel.xaxis.mode === 'histogram' && !this.panel.stack && list.length > 1) {
      const first = list[0];
      // @ts-ignore
      first.alias = first.aliasEscaped = 'Count';

      for (let i = 1; i < list.length; i++) {
        first.datapoints = first.datapoints.concat(list[i].datapoints);
      }

      return [first];
    }

    return list;
  }

  private toTimeSeries(
    field: Field,
    alias: string,
    dataFrameIndex: number,
    fieldIndex: number,
    datapoints: any[][],
    index: number,
    range?: TimeRange
  ) {
    const colorIndex = index % colors.length;
    const color = this.panel.aliasColors[alias] || colors[colorIndex];

    const series = new TimeSeries({
      datapoints: datapoints || [],
      alias: alias,
      color: getColorForTheme(color, config.theme),
      unit: field.config ? field.config.unit : undefined,
      dataFrameIndex,
      fieldIndex,
    });

    if (datapoints && datapoints.length > 0 && range) {
      const last = datapoints[datapoints.length - 1][1];
      const from = range.from;

      if (last - from.valueOf() < -10000) {
        // If the data is in reverse order
        const first = datapoints[0][1];
        if (first - from.valueOf() < -10000) {
          series.isOutsideRange = true;
        }
      }
    }
    return series;
  }
}
