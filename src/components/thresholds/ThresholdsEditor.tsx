import React, { useState } from 'react';
import { orderBy } from 'lodash';
import { Button } from '@grafana/ui';
import { v4 as uuidv4 } from 'uuid';
import { PolystatThreshold, ThresholdItemTracker } from './types';
import { ThresholdItem } from './ThresholdItem';

interface Props {
  thresholds: PolystatThreshold[];
  setter: any;
}
export const ThresholdsEditor: React.FC<Props> = (options) => {
  const [tracker, _setTracker] = useState((): ThresholdItemTracker[] => {
    if (!options.thresholds) {
      const empty: ThresholdItemTracker[] = [];
      return empty;
    }
    const items: ThresholdItemTracker[] = [];
    options.thresholds.forEach((value: PolystatThreshold, index: number) => {
      items[index] = {
        threshold: value,
        order: index,
        ID: uuidv4(),
      };
    });
    return items;
  });

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
    const orderedThresholds = orderBy(allThresholds, ['threshold.value'], ['desc']);
    setTracker([...orderedThresholds]);
  };

  const updateThresholdColor = (index: number, color: string) => {
    tracker[index].threshold.color = color;
    setTracker([...tracker]);
  };

  const updateThresholdState = (index: number, state: number) => {
    tracker[index].threshold.state = state;
    // set the color also
    setTracker([...tracker]);
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
      console.log(`old index ${allThresholds[i].order}`);
      allThresholds[i].order = i;
      console.log(`new index ${allThresholds[i].order}`);
    }
    setTracker([...allThresholds]);
  };

  const addItem = () => {
    const order = tracker.length;
    const aThreshold: PolystatThreshold = {
      color: '#299c46', // "rgba(50, 172, 45, 1)",  // green
      state: 0,
      value: 0,
    };
    const aTracker: ThresholdItemTracker = {
      threshold: aThreshold,
      order: order,
      ID: uuidv4(),
    };
    setTracker([...tracker, aTracker]);
  };

  return (
    <>
      <Button fill="solid" variant="primary" icon="plus" onClick={addItem}>
        Add Threshold
      </Button>
      {tracker &&
        tracker.map((tracker: ThresholdItemTracker, index: number) => {
          return (
            <ThresholdItem
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
