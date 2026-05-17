import { DEFAULT_CRITICAL_COLOR, DEFAULT_OK_COLOR, DEFAULT_WARNING_COLOR } from '../defaults';
import React from 'react';

import { createColor, fromHex, rgbaToHex, asHex, mul } from './color';

const PURE_LIGHT = createColor(255, 255, 255);
const OK_COLOR_END_HEX = asHex(mul(DEFAULT_OK_COLOR, PURE_LIGHT, 0.7)); // '#299c46' darkened
const WARNING_COLOR_END_HEX = asHex(mul(DEFAULT_WARNING_COLOR, PURE_LIGHT, 0.7)); // '#ed8128' darkened
const CRITICAL_COLOR_END_HEX = asHex(mul(DEFAULT_CRITICAL_COLOR, PURE_LIGHT, 0.7)); // '#f53636' darkened
const OK_COLOR_START_HEX = asHex(DEFAULT_OK_COLOR); // '#299c46', // "rgba(50, 172, 45, 1)", // green
const WARNING_COLOR_START_HEX = asHex(DEFAULT_WARNING_COLOR); // #FFC837 // '#e5ac0e', // "rgba(237, 129, 40, 1)", // yellow
const CRITICAL_COLOR_START_HEX = asHex(DEFAULT_CRITICAL_COLOR); // #e52d27 // '#bf1b00', // "rgba(245, 54, 54, 1)", // red

export interface GradientProps {
  data: any;
  gradientId: string;
}
export const Gradients: React.FC<GradientProps> = (options) => {
  const createGradients = (data: any): any => {
    const gradients = [];
    for (let i = 0; i < data.length; i++) {
      // color can be in hex or in rgb
      let useColor: string = data[i].color;
      if (useColor.startsWith('rgba')) {
        useColor = rgbaToHex(useColor);
      }
      const aColorStart = fromHex(useColor);
      const aColorEnd = mul(aColorStart, PURE_LIGHT, 0.7);
      gradients.push({ start: asHex(aColorStart), end: asHex(aColorEnd) });
    }
    return gradients;
  };
  const colorGradients = createGradients(options.data);

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
