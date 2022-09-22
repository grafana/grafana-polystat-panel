import React, { useEffect, useState } from 'react';

import { Input, Field, IconButton, HorizontalGroup, Cascader, CascaderOption } from '@grafana/ui';
import { CompositeMetricItemProps } from './types';

export const CompositeMetricItem: React.FC<CompositeMetricItemProps> = (props) => {
  const [metricHints, setMetricHints] = useState<CascaderOption[]>([]);

  async function copySelectedMetricToClipboard(index: number) {
    if (props.metric.seriesMatch) {
      const aValue = props.metric.seriesMatch;
      if ('clipboard' in navigator) {
        if (aValue) {
          return await navigator.clipboard.writeText(aValue);
        }
      } else {
        if (aValue) {
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

  useEffect(() => {
    if (props.context.data) {
      const frames = props.context.data;
      let hints: CascaderOption[] = [];
      for (let i = 0; i < frames.length; i++) {
        hints.push({
          label: frames[i].name,
          value: frames[i].name,
        });
      }
      setMetricHints(hints);
    }
  }, [props.context.data]);

  return (
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
      <Field label="Metric/RegEx" style={{ minWidth: '125px' }} disabled={props.disabled}>
        <Cascader
          key={`cmi-index-${props.index}`}
          initialValue={props.metric.seriesMatch}
          allowCustomValue
          placeholder=""
          options={metricHints}
          onSelect={(val: string) => updateMetric(val)}
        />
      </Field>
      <Field label="Alias" style={{ minWidth: '125px' }} disabled={props.disabled}>
        <Input value={props.metric.alias} placeholder="" onChange={(e) => updateMetricAlias(e.currentTarget.value)} />
      </Field>
    </HorizontalGroup>
  );
};
