import React, { useState } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { OverrideItem } from './OverrideItem';
import { OverrideItemType, OverrideItemTracker } from './types';
import { v4 as UUIdv4 } from 'uuid';
import { Button, Collapse } from '@grafana/ui';
import { PolystatThreshold } from '../thresholds/types';
import { OperatorOptions, ShowTimestampFormats } from '../types';
import {
  DEFAULT_CRITICAL_COLOR_HEX,
  DEFAULT_NO_THRESHOLD_COLOR_HEX,
  DEFAULT_OK_COLOR_HEX,
  DEFAULT_WARNING_COLOR_HEX,
} from '../defaults';

export interface OverrideEditorSettings {
  overrides: OverrideItemType[];
  enabled: boolean;
}

interface Props extends StandardEditorProps<string | string[] | null, OverrideEditorSettings> {}

export const OverrideEditor: React.FC<Props> = ({ item, context, onChange }) => {
  const [settings] = useState(context.options.overrideConfig);
  const [tracker, _setTracker] = useState((): OverrideItemTracker[] => {
    if (!settings.overrides) {
      return [] as OverrideItemTracker[];
    }
    const items: OverrideItemTracker[] = [];
    settings.overrides.forEach((value: OverrideItemType, index: number) => {
      items[index] = {
        override: value,
        order: index,
        ID: UUIdv4(),
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
    const overrideConfig = {
      overrides: allOverrides,
      enabled: settings.enabled,
    };
    onChange(overrideConfig as any);
  };

  const [isOpen, setIsOpen] = useState((): boolean[] => {
    if (!tracker) {
      return [] as boolean[];
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

  const createDuplicate = (index: number) => {
    const original = tracker[index].override;
    const order = tracker.length;
    const anOverride: OverrideItemType = {
      label: `${original.label} Copy`,
      enabled: original.enabled,
      metricName: original.metricName,
      alias: original.alias,
      thresholds: original.thresholds,
      prefix: original.prefix,
      suffix: original.suffix,
      clickThrough: original.clickThrough,
      clickThroughOpenNewTab: original.clickThroughOpenNewTab,
      clickThroughSanitize: original.clickThroughSanitize,
      clickThroughCustomTargetEnabled: original.clickThroughCustomTargetEnabled,
      clickThroughCustomTarget: original.clickThroughCustomTarget,
      showTimestampEnabled: false,
      showTimestampFormat: ShowTimestampFormats[0].value,
      showTimestampYOffset: 0,
      unitFormat: original.unitFormat,
      scaledDecimals: original.scaledDecimals,
      decimals: original.decimals,
      colors: original.colors,
      operatorName: original.operatorName,
      order: order,
    };
    const aTracker: OverrideItemTracker = {
      override: anOverride,
      order: order,
      ID: UUIdv4(),
    };
    setTracker([...tracker, aTracker]);
    setIsOpen([...isOpen, true]);
  };

  // generic move
  const arrayMove = (arr: any, oldIndex: number, newIndex: number) => {
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
      arrayMove(tracker, index, index + 1);
      // reorder
      for (let i = 0; i < tracker.length; i++) {
        tracker[i].order = i;
        tracker[i].override.order = i;
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
        tracker[i].override.order = i;
      }
      setTracker([...tracker]);
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
      allOverrides[i].order = i;
      allOverrides[i].override.order = i;
    }
    setTracker([...allOverrides]);
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
      metricName: '',
      alias: '',
      thresholds: [] as PolystatThreshold[],
      prefix: '',
      suffix: '',
      clickThrough: '',
      clickThroughOpenNewTab: true,
      clickThroughSanitize: true,
      clickThroughCustomTargetEnabled: false,
      clickThroughCustomTarget: '',
      showTimestampEnabled: false,
      showTimestampFormat: ShowTimestampFormats[0].value,
      showTimestampYOffset: 0,
      unitFormat: 'short',
      scaledDecimals: null,
      decimals: '2',
      colors: [
        DEFAULT_OK_COLOR_HEX,
        DEFAULT_WARNING_COLOR_HEX,
        DEFAULT_CRITICAL_COLOR_HEX,
        DEFAULT_NO_THRESHOLD_COLOR_HEX,
      ],
      operatorName: OperatorOptions[0].value,
      order: order,
    };
    const aTracker: OverrideItemTracker = {
      override: anOverride,
      order: order,
      ID: UUIdv4(),
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
                context={context}
              />
            </Collapse>
          );
        })}
    </>
  );
};
