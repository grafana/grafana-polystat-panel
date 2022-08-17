import React, { useState } from 'react';

import { Input, Select, Field, IconButton, HorizontalGroup } from '@grafana/ui';
import { CompositeMetricItemProps } from './types';
import { SelectableValue } from '@grafana/data';

export const CompositeMetricItem: React.FC<CompositeMetricItemProps> = (options) => {
  const [customOptions, setCustomOptions] = useState<Array<SelectableValue<string>>>([]);

  // TODO: testing selection presets
  const optionPresets: SelectableValue[] = [
    { label: 'Basic option', value: 0 },
    { label: 'Option with description', value: 1, description: 'this is a description' },
    {
      label: 'Option with description and image',
      value: 2,
      description: 'Longer description.',
      imgUrl: 'https://image.fake',
    },
  ];

  //console.log('Composite Metric Item');
  //console.log(options.metric);
  //console.log(options.metric.seriesMatch);
  async function copySelectedMetricToClipboard(index: number) {
    if (options.metric.seriesMatch?.value) {
      const aValue = options.metric.seriesMatch.value;
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
    options.updateMetric(options.index, v);
  };

  return (
    <HorizontalGroup>
      <IconButton
        key="deleteMetric"
        variant="destructive"
        name="trash-alt"
        tooltip="Delete this metric"
        onClick={() => options.removeMetric(options.index)}
      />
      <IconButton
        key="copyMetric"
        variant="secondary"
        name="copy"
        tooltip="Copy Metric/Regex"
        onClick={() => copySelectedMetricToClipboard(options.index)}
      />
      <Field label="Metric/RegEx" disabled={options.disabled}>
        <Select
          width={24}
          key={`cmi-index-${options.index}`}
          allowCustomValue
          options={[...optionPresets, ...customOptions]}
          value={options.metric.seriesMatch}
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
      <Field label="Alias" disabled={options.disabled}>
        <Input value={options.metric.alias} placeholder="" />
      </Field>
    </HorizontalGroup>
  );
};
