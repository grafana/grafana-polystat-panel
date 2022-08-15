import React from 'react';
import { GrafanaTheme } from '@grafana/data';

import { Input, ColorPicker, IconButton, useStyles, Select } from '@grafana/ui';
import { css } from 'emotion';

import { PolystatThreshold, ThresholdStates } from './types';

interface ThresholdItemProps {
  threshold: PolystatThreshold;
  key: string;
  ID: string;
  valueSetter: any;
  colorSetter: any;
  stateSetter: any;
  remover: any;
  index: number;
}

export const ThresholdItem: React.FC<ThresholdItemProps> = (options: ThresholdItemProps) => {
  const styles = useStyles(getThresholdStyles);

  return (
    <Input
      type="number"
      step="1.0"
      key={options.ID}
      onChange={(e) => options.valueSetter(options.index, Number(e.currentTarget.value))}
      value={options.threshold.value}
      prefix={
        <div className={styles.inputPrefix}>
          <div className={styles.colorPicker}>
            <ColorPicker
              color={options.threshold.color}
              onChange={(color) => options.colorSetter(options.index, color)}
              enableNamedColors={true}
            />
          </div>
        </div>
      }
      suffix={
        <>
          <Select
            value={options.threshold.state}
            onChange={(v) => {
              options.stateSetter(options.index, v);
            }}
            options={ThresholdStates}
          />
          <IconButton
            key="deleteThreshold"
            variant="destructive"
            name="trash-alt"
            tooltip="Delete Threshold"
            onClick={() => options.remover(options.index)}
          />
        </>
      }
    />
  );
};

const getThresholdStyles = (theme: GrafanaTheme) => {
  return {
    inputPrefix: css`
      display: flex;
      align-items: center;
    `,
    colorPicker: css`
      padding: 0 ${theme.spacing.sm};
    `,
  };
};
