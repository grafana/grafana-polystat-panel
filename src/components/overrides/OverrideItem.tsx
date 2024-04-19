import React, { useEffect, useState } from 'react';

import {
  IconName,
  Input,
  Field,
  FieldSet,
  Switch,
  Card,
  IconButton,
  UnitPicker,
  Select,
  Cascader,
  CascaderOption,
} from '@grafana/ui';
import { OverrideItemProps, OverrideItemType } from './types';
import { ThresholdsEditor } from '../thresholds/ThresholdsEditor';
import { PolystatThreshold } from '../thresholds/types';
import { OperatorOptions, ShowTimestampFormats } from '../types';
import { SelectableValue } from '@grafana/data';
import { getMetricHints } from '../metric_hints';

export const OverrideItem: React.FC<OverrideItemProps> = (props) => {
  const [metricHints, setMetricHints] = useState<CascaderOption[]>([]);
  const [override, _setOverride] = useState(props.override);

  const setOverride = (value: OverrideItemType) => {
    _setOverride(value);
    props.setter(override.order, value);
  };
  const [visibleIcon] = useState<IconName>('eye');
  const [hiddenIcon] = useState<IconName>('eye-slash');

  const getOperator = (operatorName: string) => {
    const keys = OperatorOptions.keys();
    for (const aKey of keys) {
      if (OperatorOptions[aKey].value === operatorName) {
        return OperatorOptions[aKey];
      }
    }
    // no match, return last not null by default
    return OperatorOptions[5];
  };
  const [operatorName, setOperatorName] = useState<SelectableValue>(getOperator(props.override.operatorName));
  const removeItem = () => {
    props.remover(override.order);
  };

  const moveUp = () => {
    props.moveUp(override.order);
  };
  const moveDown = () => {
    props.moveDown(override.order);
  };
  const createDuplicate = () => {
    props.createDuplicate(override.order);
  };

  const setThresholds = (val: PolystatThreshold[]) => {
    setOverride({ ...override, thresholds: val });
  };

  useEffect(() => {
    if (props.context.data) {
      const frames = props.context.data;
      let hints: CascaderOption[] = [];
      let metricHints = getMetricHints(frames);
      for (const metricName of metricHints) {
        hints.push({
          label: metricName,
          value: metricName,
        });
      }
      setMetricHints(hints);
    }
  }, [props.context.data]);

  return (
    <Card key={`override-card-${props.ID}`}>
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
            <Cascader
              initialValue={override.metricName}
              allowCustomValue
              placeholder=""
              options={metricHints}
              onSelect={(val: string) => setOverride({ ...override, metricName: val })}
            />
          </Field>
          <Field label="Alias" disabled={!override.enabled} hidden={true}>
            <Input
              value={override.alias}
              placeholder=""
              onChange={(e) => setOverride({ ...override, alias: e.currentTarget.value })}
            />
          </Field>
          <Field label="Decimals" disabled={!override.enabled}>
            <Input
              value={override.decimals}
              type="number"
              step={1}
              placeholder=""
              onChange={(e) => setOverride({ ...override, decimals: e.currentTarget.value })}
            />
          </Field>
          <Field label="Stat" description="The statistic to be displayed" disabled={!override.enabled}>
            <Select
              menuShouldPortal={true}
              value={operatorName}
              onChange={(v) => {
                setOperatorName(v);
                setOverride({ ...override, operatorName: v.value });
              }}
              options={OperatorOptions}
            />
          </Field>
          <Field label="Unit Format" disabled={!override.enabled}>
            {override.enabled ? (
              <UnitPicker
                value={override.unitFormat}
                onChange={(val: any) => setOverride({ ...override, unitFormat: val })}
              />
            ) : (
              <span>{override.unitFormat}</span>
            )}
          </Field>
          {/*
          <Field label="Show Timestamp" description="Toggle Display of Timestamp" disabled={!override.enabled}>
            <Switch
              transparent={true}
              value={override.showTimestampEnabled}
              disabled={!override.enabled}
              onChange={() => setOverride({ ...override, showTimestampEnabled: !override.showTimestampEnabled })}
            />
          </Field>
          <Field label="Timestamp Format" description="Format of timestamp to display" disabled={!override.enabled} hidden={!override.showTimestampEnabled}>
            <Cascader
              initialValue={override.showTimestampFormat}
              allowCustomValue
              placeholder=""
              options={ShowTimestampFormats}
              onSelect={(val: string) => setOverride({ ...override, showTimestampFormat: val })}
            />
          </Field>
          <Field label="Timestamp Y Offset" description="Adjust the displayed timestamp up or down the Y-Axis, use negative value to move up, positive for down" disabled={!override.enabled} hidden={!override.showTimestampEnabled}>
            <Input
              value={override.showTimestampYOffset}
              type="number"
              step={1}
              placeholder="0"
              onChange={(v) => setOverride({ ...override, showTimestampYOffset: v.currentTarget.valueAsNumber })}
            />
          </Field>
          */}

          <Field label="Thresholds" disabled={!override.enabled}>
            <ThresholdsEditor disabled={!override.enabled} thresholds={override.thresholds} setter={setThresholds} />
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
          <Field label="Open URL in New Tab" description="Open link in new tab" disabled={!override.enabled}>
            <Switch
              transparent={false}
              value={override.clickThroughOpenNewTab}
              disabled={!override.enabled}
              onChange={() => setOverride({ ...override, clickThroughOpenNewTab: !override.clickThroughOpenNewTab })}
            />
          </Field>
          <Field label="Enable Custom URL Target" description="Enable custom target" disabled={!override.enabled} hidden={override.clickThroughOpenNewTab}>
            <Switch
              transparent={false}
              value={override.clickThroughCustomTargetEnabled}
              disabled={!override.enabled}
              onChange={() => setOverride({ ...override,
                clickThroughCustomTargetEnabled: !override.clickThroughCustomTargetEnabled,
                clickThroughCustomTarget: override.clickThroughCustomTarget || ''
              })}
            />
          </Field>
          <Field label="Custom URL Target" description="Specify a custom target, typical values are: _blank|_self|_parent|_top|framename" disabled={!override.enabled} hidden={!override.clickThroughCustomTargetEnabled}>
            <Input
              value={override.clickThroughCustomTarget}
              placeholder="_self"
              disabled={!override.enabled}
              onChange={(e) => setOverride({ ...override, clickThroughCustomTarget: e.currentTarget.value })}
            />
          </Field>
        </FieldSet>
      </Card.Meta>

      <Card.Actions>
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
      </Card.Actions>
    </Card>
  );
};
