import React, { useState } from 'react';

import { IconName, Input, Field, FieldSet, Switch, Card, IconButton, UnitPicker } from '@grafana/ui';
import { OverrideItemProps, OverrideItemType } from './types';
import { ThresholdsEditor } from 'components/thresholds/ThresholdsEditor';
import { PolystatThreshold } from 'components/thresholds/types';

export const OverrideItem: React.FC<OverrideItemProps> = (options: OverrideItemProps) => {
  const [override, _setOverride] = useState(options.override);
  const setOverride = (value: OverrideItemType) => {
    _setOverride(value);
    options.setter(override.order, value);
  };
  const [visibleIcon] = useState<IconName>('eye');
  const [hiddenIcon] = useState<IconName>('eye-slash');
  const removeItem = () => {
    options.remover(override.order);
  };

  const moveUp = () => {};
  const moveDown = () => {};
  const createDuplicate = () => {};

  const setThresholds = (val: PolystatThreshold[]) => {
    setOverride({ ...override, thresholds: val });
  };

  return (
    <Card heading="" key={`override-card-${options.ID}`}>
      <Card.Meta>
        <FieldSet>
          <Field
            label="Label"
            description="Sets the name of the override in the configuration editor."
            disabled={!override.enabled}
          >
            <Input
              value={override.label}
              placeholder=""
              onChange={(e) => setOverride({ ...override, label: e.currentTarget.value })}
            />
          </Field>
          <Field label="Metric/RegEx" disabled={!override.enabled}>
            <Input
              value={override.metricName}
              placeholder=""
              onChange={(e) => setOverride({ ...override, metricName: e.currentTarget.value })}
            />
          </Field>
          <Field label="Alias" disabled={!override.enabled}>
            <Input value={override.alias} placeholder="" />
          </Field>
          <Field label="Unit Format" disabled={!override.enabled}>
            <UnitPicker value={override.unitFormat} onChange={(val) => (override.unitFormat = val)} />
          </Field>
          <Field label="Thresholds" disabled={!override.enabled}>
            <ThresholdsEditor thresholds={override.thresholds} setter={setThresholds} />
          </Field>
          <Field label="Prefix" description="Apply text to beginning of metric" disabled={!override.enabled}>
            <Input
              value={override.prefix}
              placeholder=""
              onChange={(e) => setOverride({ ...override, prefix: e.currentTarget.value })}
            />
          </Field>
          <Field label="Suffix" description="Apply text to end of metric" disabled={!override.enabled}>
            <Input
              value={override.suffix}
              placeholder=""
              onChange={(e) => setOverride({ ...override, suffix: e.currentTarget.value })}
            />
          </Field>
          <Field label="Clickthrough URL" description="URL to Open on Click" disabled={!override.enabled}>
            <Input
              value={override.clickThrough}
              placeholder="https://"
              onChange={(e) => setOverride({ ...override, clickThrough: e.currentTarget.value })}
            />
          </Field>
          <Field label="Sanitize URL" description="Sanitize URL before evaluating" disabled={!override.enabled}>
            <Switch
              transparent={false}
              disabled={!override.enabled}
              value={override.clickThroughSanitize}
              onChange={() => setOverride({ ...override, clickThroughSanitize: !override.clickThroughSanitize })}
            />
          </Field>
          <Field label="Open in New Tab" description="Open link in new tab" disabled={!override.enabled}>
            <Switch
              transparent={false}
              value={override.clickThroughOpenNewTab}
              disabled={!override.enabled}
              onChange={() => setOverride({ ...override, clickThroughOpenNewTab: !override.clickThroughOpenNewTab })}
            />
          </Field>
        </FieldSet>
      </Card.Meta>

      <Card.SecondaryActions>
        <IconButton key="moveUp" name="arrow-up" tooltip="Move Up" onClick={moveUp} />
        <IconButton key="moveDown" name="arrow-down" tooltip="Move Down" onClick={moveDown} />
        <IconButton
          key="overrideEnabled"
          name={override.enabled ? visibleIcon : hiddenIcon}
          tooltip="Hide/Show Override"
          onClick={() => setOverride({ ...override, enabled: !override.enabled })}
        />
        <IconButton key="copyOverride" name="copy" tooltip="Duplicate" onClick={createDuplicate} />
        <IconButton
          key="deleteOverride"
          variant="destructive"
          name="trash-alt"
          tooltip="Delete Override"
          onClick={removeItem}
        />
      </Card.SecondaryActions>
    </Card>
  );
};
