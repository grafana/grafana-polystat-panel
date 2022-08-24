import React from 'react';

import { Input, Field, IconButton, HorizontalGroup } from '@grafana/ui';
import { CompositeMetricItemProps } from './types';

export const CompositeMetricItem: React.FC<CompositeMetricItemProps> = (props) => {
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
      <Field label="Metric/RegEx" disabled={props.disabled}>
        <Input
          key={`cmi-index-${props.index}`}
          value={props.metric.seriesMatch}
          placeholder=""
          onChange={(e) => updateMetric(e.currentTarget.value)}
        />
      </Field>
      <Field label="Alias" disabled={props.disabled}>
        <Input value={props.metric.alias} placeholder="" onChange={(e) => updateMetricAlias(e.currentTarget.value)} />
      </Field>
    </HorizontalGroup>
  );
};
