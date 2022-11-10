import React, { useState } from 'react';

import { IconName, Button, Input, Select, Field, FieldSet, Switch, Card, IconButton } from '@grafana/ui';
import { DisplayModes, CompositeItemProps, CompositeMetric, CompositeItemType } from './types';
import { CompositeMetricItem } from './CompositeMetricItem';
import { v4 as uuidv4 } from 'uuid';
import { SelectableValue } from '@grafana/data';

export const CompositeItem: React.FC<CompositeItemProps> = (props: CompositeItemProps) => {
  const [composite, _setComposite] = useState(props.composite);
  const getDisplayMode = (displayMode: string) => {
    const keys = DisplayModes.keys();
    for (const aKey of keys) {
      if (DisplayModes[aKey].value === displayMode) {
        return DisplayModes[aKey];
      }
    }
    // no match, return all by default
    return DisplayModes[0];
  };
  const [displayMode, setDisplayMode] = useState<SelectableValue<any>>(getDisplayMode(props.composite.displayMode));
  const setComposite = (value: CompositeItemType) => {
    _setComposite(value);
    props.setter(composite.order, value);
  };
  const [visibleIcon] = useState<IconName>('eye');
  const [hiddenIcon] = useState<IconName>('eye-slash');
  const removeItem = () => {
    //alert('high');
    props.remover(composite.order);
    // call parent remove function
  };

  const toggleShowName = () => {
    const currentState = composite.showName;
    //setShowName(!currentState);
    setComposite({ ...composite, showName: !currentState });
  };

  const removeMetric = (index: number) => {
    let allMetrics = [...props.composite.metrics];
    allMetrics.splice(index, 1);
    setComposite({ ...props.composite, metrics: allMetrics });
  };
  const moveUp = () => {
    props.moveUp(composite.order);
  };
  const moveDown = () => {
    props.moveDown(composite.order);
  };
  const createDuplicate = () => {
    props.createDuplicate(composite.order);
  };

  const updateMetric = (index: number, value: string) => {
    const allMetrics = props.composite.metrics;
    allMetrics[index].seriesMatch = value;
    setComposite({ ...props.composite, metrics: allMetrics });
  };

  const updateMetricAlias = (index: number, alias: string) => {
    const allMetrics = props.composite.metrics;
    allMetrics[index].alias = alias;
    setComposite({ ...props.composite, metrics: allMetrics });
  };

  const addMetric = () => {
    const newMetric: CompositeMetric = {
      seriesMatch: '',
      ID: uuidv4(),
      order: 0,
    };
    if (!composite.metrics) {
      const currentMetrics: CompositeMetric[] = [];
      currentMetrics.push(newMetric);
      setComposite({ ...composite, metrics: currentMetrics });
    } else {
      const currentMetrics: CompositeMetric[] = composite.metrics;
      newMetric.order = currentMetrics.length;
      currentMetrics.push(newMetric);
      setComposite({ ...composite, metrics: currentMetrics });
    }
  };

  return (
    <Card heading="" key={`composite-card-${props.ID}`}>
      <Card.Meta>
        <FieldSet>
          <Field label="Composite Name" description="Name or Regular Expression" disabled={!composite.showComposite}>
            <Input
              value={composite.name}
              placeholder=""
              onChange={(e) => setComposite({ ...composite, name: e.currentTarget.value })}
            />
          </Field>
          <Field label="Show Name" description="Toggle Display of composite name" disabled={!composite.showComposite}>
            <Switch
              transparent={true}
              value={composite.showName}
              disabled={!composite.showComposite}
              onChange={toggleShowName}
            ></Switch>
          </Field>
          <Field label="Show Value" description="Toggle Display of composite value" disabled={!composite.showComposite}>
            <Switch
              transparent={true}
              value={composite.showValue}
              disabled={!composite.showComposite}
              onChange={() => setComposite({ ...composite, showValue: !composite.showValue })}
            />
          </Field>
          <Field
            label="Show Members"
            description="Toggle Display of composite members"
            disabled={!composite.showComposite}
          >
            <Switch
              transparent={true}
              value={composite.showMembers}
              disabled={!composite.showComposite}
              onChange={() => setComposite({ ...composite, showMembers: !composite.showMembers })}
            />
          </Field>
          <Field
            label="Display Mode"
            description="All will display all members, Triggered will only display those meeting threshold settings"
            disabled={!composite.showComposite}
          >
            <Select
              menuShouldPortal={true}
              value={displayMode}
              onChange={(v) => {
                setDisplayMode(v);
                setComposite({ ...composite, displayMode: v.value });
              }}
              options={DisplayModes}
            />
          </Field>
          <Field label="Clickthrough URL" description="URL to Open on Click" disabled={!composite.showComposite}>
            <Input
              value={composite.clickThrough}
              placeholder="https://"
              onChange={(e) => setComposite({ ...composite, clickThrough: e.currentTarget.value })}
            />
          </Field>
          <Field label="Sanitize URL" description="Sanitize URL before evaluating" disabled={!composite.showComposite}>
            <Switch
              transparent={false}
              disabled={!composite.showComposite}
              value={composite.clickThroughSanitize}
              onChange={() => setComposite({ ...composite, clickThroughSanitize: !composite.clickThroughSanitize })}
            />
          </Field>
          <Field label="Open in New Tab" description="Open link in new tab" disabled={!composite.showComposite}>
            <Switch
              transparent={false}
              value={composite.clickThroughOpenNewTab}
              disabled={!composite.showComposite}
              onChange={() => setComposite({ ...composite, clickThroughOpenNewTab: !composite.clickThroughOpenNewTab })}
            />
          </Field>
          <Field disabled={!composite.showComposite}>
            <Button
              key="addMetric"
              variant="primary"
              icon="plus"
              disabled={!composite.showComposite}
              onClick={addMetric}
            >
              Add Metric
            </Button>
          </Field>
          {composite.metrics &&
            composite.metrics.map((item: CompositeMetric, index: number) => {
              // generate ID if it doesn't exist
              if (!item.ID) {
                item.ID = uuidv4();
              }
              return (
                <CompositeMetricItem
                  key={`composite-metric-id-${item.ID}`}
                  metric={item}
                  index={index}
                  disabled={!composite.showComposite}
                  updateMetric={updateMetric}
                  updateMetricAlias={updateMetricAlias}
                  removeMetric={removeMetric}
                  context={props.context}
                />
              );
            })}
        </FieldSet>
      </Card.Meta>
      <Card.Actions>
        <IconButton key="moveUp" name="arrow-up" tooltip="Move Up" onClick={moveUp} />
        <IconButton key="moveDown" name="arrow-down" tooltip="Move Down" onClick={moveDown} />
        <IconButton
          key="showComposite"
          name={composite.showComposite ? visibleIcon : hiddenIcon}
          tooltip="Hide/Show Composite"
          onClick={() => setComposite({ ...composite, showComposite: !composite.showComposite })}
        />
        <IconButton key="copyComposite" name="copy" tooltip="Duplicate" onClick={createDuplicate} />
        <IconButton
          key="deleteComposite"
          variant="destructive"
          name="trash-alt"
          tooltip="Delete Composite"
          onClick={removeItem}
        />
      </Card.Actions>
    </Card>
  );
};
