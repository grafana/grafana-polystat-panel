import React, { useState } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Field } from '@grafana/ui';

import { PolystatThreshold } from './types';
import { ThresholdsEditor } from './ThresholdsEditor';

export interface GlobalThresholdEditorSettings {}

interface Props extends StandardEditorProps<string | string[] | null, GlobalThresholdEditorSettings> {}

export const GlobalThresholdEditor: React.FC<Props> = ({ context, onChange }) => {
  const [globalThresholds, setGlobalThresholds] = useState(context.options.globalThresholdsConfig);
  const setThresholds = (val: PolystatThreshold[]) => {
    setGlobalThresholds(val);
    onChange(val as any);
  };

  return (
    <>
      <Field>
        <ThresholdsEditor thresholds={globalThresholds} setter={setThresholds} />
      </Field>
    </>
  );
};
