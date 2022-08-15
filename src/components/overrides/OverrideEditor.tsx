import React, { useState } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { OverrideItem } from './OverrideItem';
import { OverrideItemType, OverrideItemTracker } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Button, Collapse } from '@grafana/ui';
import { PolystatThreshold } from 'components/thresholds/types';

export interface OverrideEditorSettings {
  overrides: OverrideItemType[];
  enabled: boolean;
}

interface Props extends StandardEditorProps<string | string[] | null, OverrideEditorSettings> {}

export const OverrideEditor: React.FC<Props> = ({ item, context }) => {
  const [settings] = useState(context.options.overrideConfig);
  const [tracker, _setTracker] = useState((): OverrideItemTracker[] => {
    if (!settings.overrides) {
      const empty: OverrideItemTracker[] = [];
      return empty;
    }
    const items: OverrideItemTracker[] = [];
    settings.overrides.forEach((value: OverrideItemType, index: number) => {
      items[index] = {
        override: value,
        order: index,
        ID: uuidv4(),
      };
    });
    return items;
  });

  const setTracker = (v: OverrideItemTracker[]) => {
    _setTracker(v);
    const allOverrides: OverrideItemType[] = [];
    v.forEach((element) => {
      allOverrides.push(element.override);
    });
    context.options.overrideConfig = {
      overrides: allOverrides,
      enabled: settings.enabled,
    };
  };

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

  const updateOverride = (index: number, value: OverrideItemType) => {
    tracker[index].override = value;
    // works ... setTracker(tracker);
    setTracker([...tracker]);
  };

  const createDuplicate = (index: number) => {};

  const moveDown = (index: number) => {
    if (index !== tracker.length - 1) {
    }
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      //const allOverrides = [...tracker];
    }
  };

  const removeOverride = (index: number) => {
    const allOverrides = [...tracker];
    let removeIndex = 0;
    for (let i = 0; i < allOverrides.length; i++) {
      if (allOverrides[i].order === index) {
        removeIndex = i;
        break;
      }
    }
    allOverrides.splice(removeIndex, 1);
    // reorder
    for (let i = 0; i < allOverrides.length; i++) {
      console.log(`old index ${allOverrides[i].order}`);
      allOverrides[i].order = i;
      console.log(`new index ${allOverrides[i].order}`);
    }
    setTracker([...allOverrides]);
    // TODO: openers should be fixed too
  };

  const toggleOpener = (index: number) => {
    const currentState = [...isOpen];
    currentState[index] = !currentState[index];
    setIsOpen([...currentState]);
  };

  const addItem = () => {
    const order = tracker.length;
    const anOverride: OverrideItemType = {
      label: `Override-${order}`,
      enabled: true,
      metricName: null,
      alias: '',
      thresholds: [] as PolystatThreshold[],
      prefix: '',
      suffix: '',
      clickThrough: '',
      clickThroughOpenNewTab: true,
      clickThroughSanitize: true,
      unitFormat: 'short',
      scaledDecimals: null,
      decimals: '2',
      colors: [
        '#299c46', // "rgba(50, 172, 45, 1)",  // green
        '#e5ac0e', // "rgba(237, 129, 40, 1)", // yellow
        '#bf1b00', // "rgba(245, 54, 54, 1)",  // red
        '#4040a0', // "rgba(64, 64, 160, 1)",  // blue
      ],
      operatorName: 'avg',
      order: order,
    };
    const aTracker: OverrideItemTracker = {
      override: anOverride,
      order: order,
      ID: uuidv4(),
    };
    setTracker([...tracker, aTracker]);
    // add an opener also
    setIsOpen([...isOpen, true]);
  };

  return (
    <>
      <Button fill="solid" variant="primary" icon="plus" onClick={addItem}>
        Add Override
      </Button>
      {tracker &&
        tracker.map((tracker: OverrideItemTracker, index: number) => {
          return (
            <Collapse
              key={`collapse-item-index-${tracker.ID}`}
              label={tracker.override.label}
              isOpen={isOpen[index]}
              onToggle={() => toggleOpener(index)}
              collapsible
            >
              <OverrideItem
                key={`override-item-index-${tracker.ID}`}
                ID={tracker.ID}
                override={tracker.override}
                enabled={tracker.override.enabled}
                setter={updateOverride}
                remover={removeOverride}
                moveDown={moveDown}
                moveUp={moveUp}
                createDuplicate={createDuplicate}
              />
            </Collapse>
          );
        })}
    </>
  );
};
