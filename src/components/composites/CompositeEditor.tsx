import React, { useState } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Button, Input, Switch, Collapse, Field, FieldSet } from '@grafana/ui';

import { CompositeItem } from './CompositeItem';
import { DisplayModes, CompositeItemType, CompositeMetric, CompositeItemTracker } from './types';
import { v4 as uuidv4 } from 'uuid';

export interface CompositeEditorSettings {
  composites: CompositeItemType[];
  enabled: boolean;
  animationSpeed: string;
}

interface Props extends StandardEditorProps<string | string[] | null, CompositeEditorSettings> {}

export const CompositeEditor: React.FC<Props> = ({ context }) => {
  const [settings] = useState(context.options.compositeConfig);
  const [animationSpeed, _setAnimationSpeed] = useState(context.options.compositeConfig.animationSpeed);
  const [compositesEnabled, _setCompositesEnabled] = useState(context.options.compositeConfig.enabled);
  const [tracker, _setTracker] = useState((): CompositeItemTracker[] => {
    if (!settings.composites) {
      const empty: CompositeItemTracker[] = [];
      return empty;
    }
    const items: CompositeItemTracker[] = [];
    settings.composites.forEach((value: CompositeItemType, index: number) => {
      items[index] = {
        composite: value,
        order: index,
        ID: uuidv4(),
      };
    });
    return items;
  });

  const setAnimationSpeed = (val: any) => {
    context.options.compositeConfig.animationSpeed = val;
    _setAnimationSpeed(val);
  }
  const setCompositesEnabled = (val: any) => {
    context.options.compositeConfig.enabled = val;
    _setCompositesEnabled(val);
  }
  const setTracker = (v: CompositeItemTracker[]) => {
    _setTracker(v);
    // update the panel config (only the composites themselves, not the tracker)
    const allComposites: CompositeItemType[] = [];
    v.forEach((element) => {
      allComposites.push(element.composite);
    });
    context.options.compositeConfig = {
      composites: allComposites,
      animationSpeed: settings.animationSpeed,
      enabled: settings.enabled,
    };
  };

  // tracks composite card collapse state
  const [isOpen, setIsOpen] = useState((): boolean[] => {
    if (!tracker) {
      const empty: boolean[] = [];
      return empty;
    }
    let size = tracker.length;
    const openStates: boolean[] = [];
    while (size--) {
      openStates[size] = false;
    }
    return openStates;
  });

  // generic move
  const arrayMove = (arr: any, oldIndex: number, newIndex: number) => {
    if (newIndex >= arr.length) {
      var k = newIndex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  };

  const moveDown = (index: number) => {
    if (index !== tracker.length - 1) {
      arrayMove(tracker, index, index + 1);
      // reorder
      for (let i = 0; i < tracker.length; i++) {
        tracker[i].order = i;
        tracker[i].composite.order = i;
      }
      setTracker([...tracker]);
    }
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      arrayMove(tracker, index, index - 1);
      // reorder
      for (let i = 0; i < tracker.length; i++) {
        tracker[i].order = i;
        tracker[i].composite.order = i;
      }
      setTracker([...tracker]);
    }
  };

  const createDuplicate = (index: number) => {
    const original = tracker[index].composite;
    const order = tracker.length;
    const aComposite: CompositeItemType = {
      name: `${original.name} Copy`,
      order: order,
      templatedName: original.templatedName,
      isTemplated: original.isTemplated,
      displayMode: original.displayMode,
      enabled: original.enabled,
      showName: original.showName,
      showValue: original.showValue,
      showComposite: original.showComposite,
      showMembers: original.showMembers,
      metrics: original.metrics,
      clickThrough: original.clickThrough,
      clickThroughOpenNewTab: original.clickThroughOpenNewTab,
      clickThroughSanitize: original.clickThroughSanitize,
    };
    const aTracker: CompositeItemTracker = {
      composite: aComposite,
      order: order,
      ID: uuidv4(),
    };
    setTracker([...tracker, aTracker]);
    setIsOpen([...isOpen, true]);
  };

  const updateComposite = (index: number, value: CompositeItemType) => {
    tracker[index].composite = value;
    setTracker([...tracker]);
  };

  const removeComposite = (compositeIndex: number) => {
    // find the composite by the compositeIndex
    const allComposites = [...tracker];
    let removeIndex = 0;
    for (let i = 0; i < allComposites.length; i++) {
      if (allComposites[i].order === compositeIndex) {
        removeIndex = i;
        break;
      }
    }
    allComposites.splice(removeIndex, 1);
    // reorder
    for (let i = 0; i < allComposites.length; i++) {
      allComposites[i].order = i;
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
      showName: true,
      showValue: true,
      showMembers: false,
      showComposite: true,
      isTemplated: false,
      templatedName: `Composite-${order}`,
      enabled: true,
      metrics: [] as CompositeMetric[],
      displayMode: DisplayModes[0],
      clickThrough: '',
      clickThroughOpenNewTab: true,
      clickThroughSanitize: true,
      order: order,
    };
    const aTracker: CompositeItemTracker = {
      composite: aComposite,
      order: order,
      ID: uuidv4(),
    };
    setTracker([...tracker, aTracker]);
    // add an opener also
    setIsOpen([...isOpen, true]);
  };

  return (
    <>
      <FieldSet>
        <Field label="Enable Composites" description="Enable/Disable Composites Globally">
          <Switch
            transparent={true}
            value={compositesEnabled}
            onChange={() => setCompositesEnabled(!compositesEnabled)}
          />
        </Field>
        <Field label="Animation Speed (ms)" description="Animation Speed in milliseconds" disabled={!settings.enabled}>
          <Input
            value={animationSpeed}
            placeholder="500"
            onChange={(e: any) => setAnimationSpeed(e.currentTarget.value)}
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
              />
            </Collapse>
          );
        })}
    </>
  );
};
