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
    setGlobalThresholds({ ...globalThresholds, thresholds: val });
    context.options.globalThresholdsConfig = {
      thresholds: val,
    };
  };
  return (
    <>
      <Field>
        <ThresholdsEditor thresholds={globalThresholds.thresholds} setter={setThresholds} />
      </Field>
    </>
  );
};
