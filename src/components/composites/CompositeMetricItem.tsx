import React, { useState } from 'react';

import { Input, Select, Field, IconButton, HorizontalGroup } from '@grafana/ui';
import { CompositeMetricItemProps } from './types';
import { SelectableValue } from '@grafana/data';

export const CompositeMetricItem: React.FC<CompositeMetricItemProps> = (props) => {
  const [customOptions, setCustomOptions] = useState<Array<SelectableValue<string>>>([]);

  const optionPresets: SelectableValue[] = [];

  //console.log('Composite Metric Item');
  //console.log(options.metric);
  //console.log(options.metric.seriesMatch);
  async function copySelectedMetricToClipboard(index: number) {
    if (props.metric.seriesMatch?.value) {
      const aValue = props.metric.seriesMatch.value;
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

  const updateMetric = (v: SelectableValue) => {
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
        <Select
          menuShouldPortal={true}
          width={24}
          key={`cmi-index-${props.index}`}
          allowCustomValue
          options={[...optionPresets, ...customOptions]}
          value={props.metric.seriesMatch}
          onCreateOption={(v) => {
            const customValue: SelectableValue = { value: v, label: v, description: 'custom regex' };
            setCustomOptions([...customOptions, customValue]);
            updateMetric(customValue);
          }}
          onChange={(v) => {
            updateMetric(v);
          }}
        />
      </Field>
      <Field label="Alias" disabled={props.disabled}>
        <Input value={props.metric.alias} placeholder="" onChange={(e) => updateMetricAlias(e.currentTarget.value)} />
      </Field>
    </HorizontalGroup>
  );
};
