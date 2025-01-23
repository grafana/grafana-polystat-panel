import React, { useState } from 'react';
import { orderBy } from 'lodash';
import { Button, useTheme, useTheme2 } from '@grafana/ui';
import { v4 as UUIdv4 } from 'uuid';
import { PolystatThreshold, ThresholdItemTracker } from './types';
import { ThresholdItem } from './ThresholdItem';
import { DEFAULT_OK_COLOR_HEX, DEFAULT_WARNING_COLOR_HEX, DEFAULT_CRITICAL_COLOR_HEX } from '../defaults';

interface Props {
  thresholds: PolystatThreshold[];
  setter: any;
  disabled?: boolean;
}
export const ThresholdsEditor: React.FC<Props> = (options) => {
  const [tracker, _setTracker] = useState((): ThresholdItemTracker[] => {
    if (!options.thresholds) {
      return [] as ThresholdItemTracker[];
    }
    const items: ThresholdItemTracker[] = [];
    options.thresholds.forEach((value: PolystatThreshold, index: number) => {
      items[index] = {
        threshold: value,
        order: index,
        ID: UUIdv4(),
      };
    });
    return items;
  });
  // v9 compatible
  const theme2 = useTheme2();
  const oldTheme = useTheme();

  const setTracker = (v: ThresholdItemTracker[]) => {
    _setTracker(v);
    const allThresholds: PolystatThreshold[] = [];
    v.forEach((element) => {
      allThresholds.push(element.threshold);
    });
    options.setter(allThresholds);
  };

  const updateThresholdValue = (index: number, value: number) => {
    tracker[index].threshold.value = Number(value);
    // reorder
    const allThresholds = [...tracker];
    const orderedThresholds = orderBy(allThresholds, ['threshold.value'], ['asc']);
    setTracker([...orderedThresholds]);
  };

  const updateThresholdColor = (index: number, color: string) => {
    const useColor = theme2.visualization.getColorByName(color);
    tracker[index].threshold.color = useColor;
    setTracker([...tracker]);
  };

  const updateThresholdState = (index: number, state: any) => {
    tracker[index].threshold.state = state;
    // set the color if it is not a custom state
    if (state < 3) {
      tracker[index].threshold.color = colorForThresholdState(state);
    }
    setTracker([...tracker]);
  };

  const colorForThresholdState = (state: number) => {
    switch (state) {
      case 0:
        return DEFAULT_OK_COLOR_HEX;
      case 1:
        return DEFAULT_WARNING_COLOR_HEX;
      case 2:
        return DEFAULT_CRITICAL_COLOR_HEX;
      default:
        return DEFAULT_OK_COLOR_HEX;
    }
  };

  const removeThreshold = (index: number) => {
    const allThresholds = [...tracker];
    let removeIndex = 0;
    for (let i = 0; i < allThresholds.length; i++) {
      if (allThresholds[i].order === index) {
        removeIndex = i;
        break;
      }
    }
    allThresholds.splice(removeIndex, 1);
    // reorder
    for (let i = 0; i < allThresholds.length; i++) {
      allThresholds[i].order = i;
    }
    setTracker([...allThresholds]);
  };

  const addItem = () => {
    const order = tracker.length;
    const aThreshold: PolystatThreshold = {
      color: DEFAULT_OK_COLOR_HEX, // "rgba(50, 172, 45, 1)",  // green
      state: 0,
      value: 0,
    };
    const aTracker: ThresholdItemTracker = {
      threshold: aThreshold,
      order: order,
      ID: UUIdv4(),
    };
    setTracker([...tracker, aTracker]);
  };

  return (
    <>
      <Button disabled={options.disabled} fill="solid" variant="primary" icon="plus" onClick={addItem}>
        Add Threshold
      </Button>
      {tracker &&
        tracker.map((tracker: ThresholdItemTracker, index: number) => {
          return (
            <ThresholdItem
              disabled={options.disabled || false}
              key={`threshold-item-index-${tracker.ID}`}
              ID={tracker.ID}
              threshold={tracker.threshold}
              valueSetter={updateThresholdValue}
              colorSetter={updateThresholdColor}
              stateSetter={updateThresholdState}
              remover={removeThreshold}
              index={index}
            />
          );
        })}
    </>
  );
};
