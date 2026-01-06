import React, { useEffect, useMemo } from 'react';

import { Input, Field, IconButton, HorizontalGroup, Cascader, CascaderOption, FieldSet } from '@grafana/ui';
import { CompositeMetricItemProps } from './types';
import { getMetricHints } from '../metric_hints';

export const CompositeMetricItem: React.FC<CompositeMetricItemProps> = (props) => {
  const metricHints = useMemo(() => {
    let hints: CascaderOption[] = [];
    let allHints = getMetricHints(props.context.data);
    for (const metricName of allHints) {
      hints.push({
        label: metricName,
        value: metricName,
      });
    }
    return hints;
  }, [props.context.data]);

  async function copySelectedMetricToClipboard(index: number) {
    if (props.metric.seriesMatch) {
      const aValue = props.metric.seriesMatch;
      if ('clipboard' in navigator) {
        if (aValue) {
          return await navigator.clipboard.writeText(aValue);
        }
      } else {
        if (aValue) {
          // use the old method if clipboard is not available
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          return document.execCommand('copy', true, aValue);
        }
      }
    }
  }

  const updateMetric = (v: string) => {
    props.updateMetric(props.index, v);
  };
  const updateMetricAlias = (alias: string) => {
    props.updateMetricAlias(props.index, alias);
  };

  return (
    <FieldSet>
      <HorizontalGroup>
        <IconButton
          key="deleteMetric"
          variant="destructive"
          name="trash-alt"
          tooltip="Delete this metric"
          onClick={() => props.removeMetric(props.index)}
        />
        <IconButton
          key="copyMetric"
          variant="secondary"
          name="copy"
          tooltip="Copy Metric/Regex"
          onClick={() => copySelectedMetricToClipboard(props.index)}
        />
        <Field label="Metric/RegEx" id={`cmi-field-index-${props.index}`} style={{ minWidth: '175px' }} disabled={props.disabled}>
          <Cascader
            key={`cmi-cascader-index-${props.index}`}
            initialValue={props.metric.seriesMatch}
            allowCustomValue
            placeholder=""
            options={metricHints}
            onSelect={(val: string) => updateMetric(val)}
          />
        </Field>
        <Field label="Alias" disabled={props.disabled}>
          <Input value={props.metric.alias}
            id={`cmi-alias-index-${props.index}`}
            placeholder="" onChange={(e) => updateMetricAlias(e.currentTarget.value)} />
        </Field>
      </HorizontalGroup>
    </FieldSet>
  );
};
