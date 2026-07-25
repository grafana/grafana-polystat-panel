import { DEFAULT_CRITICAL_COLOR_HEX, DEFAULT_OK_COLOR_HEX, DEFAULT_WARNING_COLOR_HEX } from '../defaults';
import React, { useMemo } from 'react';

import { normalizeToHex, darken } from './color';

const DARKEN_FACTOR = 0.7;
const OK_COLOR_END_HEX = darken(DEFAULT_OK_COLOR_HEX, DARKEN_FACTOR); // '#299c46' darkened
const WARNING_COLOR_END_HEX = darken(DEFAULT_WARNING_COLOR_HEX, DARKEN_FACTOR); // '#ed8128' darkened
const CRITICAL_COLOR_END_HEX = darken(DEFAULT_CRITICAL_COLOR_HEX, DARKEN_FACTOR); // '#f53636' darkened
const OK_COLOR_START_HEX = DEFAULT_OK_COLOR_HEX; // '#299c46', // "rgba(50, 172, 45, 1)", // green
const WARNING_COLOR_START_HEX = DEFAULT_WARNING_COLOR_HEX; // #FFC837 // '#e5ac0e', // "rgba(237, 129, 40, 1)", // yellow
const CRITICAL_COLOR_START_HEX = DEFAULT_CRITICAL_COLOR_HEX; // #e52d27 // '#bf1b00', // "rgba(245, 54, 54, 1)", // red

export interface GradientProps {
  data: any;
  gradientId: string;
}
export const Gradients: React.FC<GradientProps> = (options) => {
  const colorGradients = useMemo(() => {
    const gradients = [];
    for (let i = 0; i < options.data.length; i++) {
      // color can be in hex or in rgb(a)
      const startHex = normalizeToHex(options.data[i].color);
      const endHex = darken(startHex, DARKEN_FACTOR);
      gradients.push({ start: startHex, end: endHex });
    }
    return gradients;
  }, [options.data]);

  const gradientId = options.gradientId;
  return (
    <>
      <defs>
        {colorGradients.map((aGradient: any, index: number) => {
          return (
            <linearGradient
              key={index}
              id={gradientId + '_linear_gradient_state_data_' + index}
              x1={'30%'}
              y1={'30%'}
              x2={'70%'}
              y2={'70%'}
            >
              <stop offset={'0%'} stopColor={aGradient.start} />
              <stop offset={'100%'} stopColor={aGradient.end} />
            </linearGradient>
          );
        })}
        <linearGradient id={gradientId + '_linear_gradient_state_ok'} x1={'30%'} y1={'30%'} x2={'70%'} y2={'70%'}>
          <stop offset={'0%'} stopColor={OK_COLOR_START_HEX} />
          <stop offset={'100%'} stopColor={OK_COLOR_END_HEX} />
        </linearGradient>
        <linearGradient id={gradientId + '_linear_gradient_state_warning'} x1={'30%'} y1={'30%'} x2={'70%'} y2={'70%'}>
          <stop offset={'0%'} stopColor={WARNING_COLOR_START_HEX} />
          <stop offset={'100%'} stopColor={WARNING_COLOR_END_HEX} />
        </linearGradient>
        <linearGradient id={gradientId + '_linear_gradient-state_critical'} x1={'30%'} y1={'30%'} x2={'70%'} y2={'70%'}>
          <stop offset={'0%'} stopColor={CRITICAL_COLOR_START_HEX} />
          <stop offset={'100%'} stopColor={CRITICAL_COLOR_END_HEX} />
        </linearGradient>
        <linearGradient id={gradientId + '_linear_gradient_state_unknown'} x1={'30%'} y1={'30%'} x2={'70%'} y2={'70%'}>
          <stop offset={'0%'} stopColor={'#73808A'} />
          <stop offset={'100%'} stopColor={'#73808A'} />
        </linearGradient>
      </defs>
    </>
  );
};
