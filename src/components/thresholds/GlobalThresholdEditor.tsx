import React, { useState } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Field } from '@grafana/ui';

import { PolystatThreshold } from './types';
import { ThresholdsEditor } from 'components/thresholds/ThresholdsEditor';

export interface GlobalThresholdEditorSettings {}

interface Props extends StandardEditorProps<string | string[] | null, GlobalThresholdEditorSettings> {}

export const GlobalThresholdEditor: React.FC<Props> = ({ context }) => {
  const [globalThresholds, setGlobalThresholds] = useState(context.options.globalThresholdsConfig);
  const setThresholds = (val: PolystatThreshold[]) => {
    setGlobalThresholds(val);
    context.options.globalThresholdsConfig = val;
  };
  return (
    <>
      <Field>
        <ThresholdsEditor thresholds={globalThresholds} setter={setThresholds} />
      </Field>
    </>
  );
};
