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

export const CompositeEditor: React.FC<Props> = ({ item, context }) => {
  const [settings, _setSettings] = useState(context.options.compositeConfig);
  const setSettings = (v: any) => {
    _setSettings(v);
    // update the panel config
    //  context.options.compositeConfig = v;
  };

  //const [tracker, _setTracker] = useState<CompositeItemTracker[]>([]);
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

  const updateComposite = (index: number, value: CompositeItemType) => {
    tracker[index].composite = value;
    // works ... setTracker(tracker);
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
      console.log(`old index ${allComposites[i].order}`);
      allComposites[i].order = i;
      console.log(`new index ${allComposites[i].order}`);
    }
    setTracker([...allComposites]);
    // TODO: openers should be fixed too
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
            value={settings.enabled}
            onChange={() => setSettings({ ...settings, enabled: !settings.enabled })}
          />
        </Field>
        <Field label="Animation Speed (ms)" description="Animation Speed in milliseconds" disabled={!settings.enabled}>
          <Input
            value={settings.animationSpeed}
            placeholder="500"
            onChange={(e: any) => setSettings({ ...settings, animationSpeed: e.currentTarget.value })}
          />
        </Field>
      </FieldSet>
      <Button fill="solid" variant="primary" icon="plus" onClick={addItem}>
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
              />
            </Collapse>
          );
        })}
    </>
  );
};
