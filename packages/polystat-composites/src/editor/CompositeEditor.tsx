import React, { useState } from 'react';

import { StandardEditorProps } from '@grafana/data';
import { Button, Collapse, Field, FieldSet, Input, Switch } from '@grafana/ui';
import { v4 as UUIDv4 } from 'uuid';

import { DEFAULT_COMPOSITE_TIMESTAMP_FORMAT } from '../core/constants';
import { CompositeItem } from './CompositeItem';
import { CompositeItemTracker, CompositeItemType, CompositeMetric, DisplayModes } from './types';

export interface CompositeEditorSettings {
  composites: CompositeItemType[];
  enabled: boolean;
  animationSpeed: string;
}

interface Props extends StandardEditorProps<string | string[] | null, CompositeEditorSettings> {}

export const CompositeEditor: React.FC<Props> = ({ context, onChange }) => {
  const [settings, setSettings] = useState<CompositeEditorSettings>(context.options.compositeConfig);
  const [tracker, _setTracker] = useState((): CompositeItemTracker[] => {
    if (settings.composites) {
      const items: CompositeItemTracker[] = [];
      settings.composites.forEach((value: CompositeItemType, index: number) => {
        items[index] = {
          composite: value,
          order: index,
          ID: UUIDv4(),
        };
      });
      return items;
    }
    return [];
  });

  const setTracker = (v: CompositeItemTracker[]) => {
    _setTracker(v);
    const allComposites: CompositeItemType[] = [];
    v.forEach((element) => {
      allComposites.push(element.composite);
    });
    const compositeConfig = {
      composites: allComposites,
      animationSpeed: settings.animationSpeed,
      enabled: settings.enabled,
    };
    onChange(compositeConfig as any);
  };

  const [isOpen, setIsOpen] = useState((): boolean[] => {
    if (!tracker) {
      return [];
    }
    let size = tracker.length;
    const openStates: boolean[] = [];
    while (size--) {
      openStates[size] = false;
    }
    return openStates;
  });

  const arrayMove = (arr: any[], oldIndex: number, newIndex: number) => {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  };

  const moveDown = (index: number) => {
    if (index !== tracker.length - 1) {
      const newTracker = [...tracker];
      arrayMove(newTracker, index, index + 1);
      for (let i = 0; i < newTracker.length; i++) {
        newTracker[i].order = i;
        newTracker[i].composite.order = i;
      }
      setTracker(newTracker);
    }
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      const newTracker = [...tracker];
      arrayMove(newTracker, index, index - 1);
      for (let i = 0; i < newTracker.length; i++) {
        newTracker[i].order = i;
        newTracker[i].composite.order = i;
      }
      setTracker(newTracker);
    }
  };

  const createDuplicate = (index: number) => {
    const original = tracker[index].composite;
    const order = tracker.length;
    const aComposite: CompositeItemType = {
      name: `${original.name} Copy`,
      label: `${original.name} Copy`,
      order,
      isTemplated: original.isTemplated,
      displayMode: original.displayMode,
      enabled: original.enabled,
      showName: original.showName,
      showValue: original.showValue,
      showComposite: original.showComposite,
      showMembers: original.showMembers,
      showTimestampEnabled: false,
      showTimestampFormat: DEFAULT_COMPOSITE_TIMESTAMP_FORMAT,
      showTimestampYOffset: 0,
      metrics: original.metrics,
      clickThrough: original.clickThrough,
      clickThroughOpenNewTab: original.clickThroughOpenNewTab,
      clickThroughSanitize: original.clickThroughSanitize,
      clickThroughCustomTargetEnabled: original.clickThroughCustomTargetEnabled,
      clickThroughCustomTarget: original.clickThroughCustomTarget,
    };
    const aTracker: CompositeItemTracker = {
      composite: aComposite,
      order,
      ID: UUIDv4(),
    };
    setTracker([...tracker, aTracker]);
    setIsOpen([...isOpen, true]);
  };

  const updateComposite = (order: number, value: CompositeItemType) => {
    setTracker(
      tracker.map((aComposite) => {
        if (aComposite.order === order) {
          aComposite.composite = value;
          return { ...aComposite };
        }
        return aComposite;
      })
    );
  };

  const removeComposite = (compositeIndex: number) => {
    const allComposites = [...tracker];
    let removeIndex = 0;
    for (let i = 0; i < allComposites.length; i++) {
      if (allComposites[i].order === compositeIndex) {
        removeIndex = i;
        break;
      }
    }
    allComposites.splice(removeIndex, 1);
    for (let i = 0; i < allComposites.length; i++) {
      allComposites[i].order = i;
      allComposites[i].composite.order = i;
    }
    setTracker([...allComposites]);
  };

  const toggleOpener = (index: number) => {
    const toggleState = [...isOpen];
    toggleState[index] = !toggleState[index];
    setIsOpen([...toggleState]);
  };

  const addItem = () => {
    const order = tracker.length;
    const aComposite: CompositeItemType = {
      name: `Composite-${order}`,
      label: `Composite-${order}`,
      showName: true,
      showValue: true,
      showMembers: false,
      showComposite: true,
      showTimestampEnabled: false,
      showTimestampFormat: DEFAULT_COMPOSITE_TIMESTAMP_FORMAT,
      showTimestampYOffset: 0,
      isTemplated: false,
      enabled: true,
      metrics: [] as CompositeMetric[],
      displayMode: DisplayModes[0].value ?? 'all',
      clickThrough: '',
      clickThroughOpenNewTab: true,
      clickThroughSanitize: true,
      clickThroughCustomTargetEnabled: false,
      clickThroughCustomTarget: '',
      order,
    };
    const aTracker: CompositeItemTracker = {
      composite: aComposite,
      order,
      ID: UUIDv4(),
    };
    setTracker([...tracker, aTracker]);
    setIsOpen([...isOpen, true]);
  };

  return (
    <>
      <FieldSet>
        <Field label="Enable Composites" description="Enable/Disable Composites Globally">
          <Switch
            transparent={true}
            value={settings.enabled}
            onChange={(e: any) => {
              const newSettings = { ...settings };
              newSettings.enabled = e.currentTarget.checked;
              setSettings(newSettings);
              onChange(newSettings as any);
            }}
          />
        </Field>
        <Field label="Animation Speed (ms)" description="Animation Speed in milliseconds" disabled={!settings.enabled}>
          <Input
            value={settings.animationSpeed}
            placeholder="500"
            onChange={(e: any) => {
              let speed = parseInt(e.currentTarget.value, 10);
              if (speed < 200 || isNaN(speed)) {
                speed = 200;
              }
              const newSettings = { ...settings };
              newSettings.animationSpeed = speed.toString();
              setSettings(newSettings);
              onChange(newSettings as any);
            }}
          />
        </Field>
      </FieldSet>
      <Button fill="solid" variant="primary" icon="plus" disabled={!settings.enabled} onClick={addItem}>
        Add Composite
      </Button>
      {tracker &&
        tracker.map((item: CompositeItemTracker, index: number) => {
          return (
            <Collapse
              key={`collapse-item-index-${item.ID}`}
              label={item.composite.name}
              isOpen={isOpen[index]}
              onToggle={() => toggleOpener(index)}
              collapsible
            >
              <CompositeItem
                key={`composite-item-index-${item.ID}`}
                ID={item.ID}
                composite={item.composite}
                enabled={item.composite.enabled}
                setter={updateComposite}
                remover={removeComposite}
                moveUp={moveUp}
                moveDown={moveDown}
                createDuplicate={createDuplicate}
                context={context}
              />
            </Collapse>
          );
        })}
    </>
  );
};
