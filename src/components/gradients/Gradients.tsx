import { DEFAULT_CRITICAL_COLOR, DEFAULT_OK_COLOR, DEFAULT_WARNING_COLOR } from '../defaults';
import React from 'react';

import { createColor, fromHex, rgbaToHex, asHex, mul } from './color';

export interface GradientProps {
  data: any;
  gradientId: string;
}
export const Gradients: React.FC<GradientProps> = (options) => {
  const pureLight = createColor(255, 255, 255);

  const createGradients = (data: any): any => {
    const gradients = [];
    for (let i = 0; i < data.length; i++) {
      // color can be in hex or in rgb
      let useColor: string = data[i].color;
      if (useColor.startsWith('rgba')) {
        useColor = rgbaToHex(useColor);
      }
      const aColorStart = fromHex(useColor);
      const aColorEnd = mul(aColorStart, pureLight, 0.7);
      gradients.push({ start: asHex(aColorStart), end: asHex(aColorEnd) });
    }
    return gradients;
  };
  const colorGradients = createGradients(options.data);
  const okColorStart = DEFAULT_OK_COLOR; // '#299c46', // "rgba(50, 172, 45, 1)", // green
  const okColorEnd = mul(okColorStart, pureLight, 0.7);
  const warningColorStart = DEFAULT_WARNING_COLOR; // #FFC837 // '#e5ac0e', // "rgba(237, 129, 40, 1)", // yellow
  const warningColorEnd = mul(warningColorStart, pureLight, 0.7);
  const criticalColorStart = DEFAULT_CRITICAL_COLOR; // #e52d27 // '#bf1b00', // "rgba(245, 54, 54, 1)", // red
  const criticalColorEnd = mul(criticalColorStart, pureLight, 0.7);

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
          <stop offset={'0%'} stopColor={asHex(okColorStart)} />
          <stop offset={'100%'} stopColor={asHex(okColorEnd)} />
        </linearGradient>
        <linearGradient id={gradientId + '_linear_gradient_state_warning'} x1={'30%'} y1={'30%'} x2={'70%'} y2={'70%'}>
          <stop offset={'0%'} stopColor={asHex(warningColorStart)} />
          <stop offset={'100%'} stopColor={asHex(warningColorEnd)} />
        </linearGradient>
        <linearGradient id={gradientId + '_linear_gradient-state_critical'} x1={'30%'} y1={'30%'} x2={'70%'} y2={'70%'}>
          <stop offset={'0%'} stopColor={asHex(criticalColorStart)} />
          <stop offset={'100%'} stopColor={asHex(criticalColorEnd)} />
        </linearGradient>
        <linearGradient id={gradientId + '_linear_gradient_state_unknown'} x1={'30%'} y1={'30%'} x2={'70%'} y2={'70%'}>
          <stop offset={'0%'} stopColor={'#73808A'} />
          <stop offset={'100%'} stopColor={'#73808A'} />
        </linearGradient>
      </defs>
    </>
  );
};
