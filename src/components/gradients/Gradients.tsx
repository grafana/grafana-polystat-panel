import { DEFAULT_CRITICAL_COLOR, DEFAULT_OK_COLOR, DEFAULT_WARNING_COLOR } from '../defaults';
import React from 'react';

import { Color } from './color';

export interface GradientProps {
  data: any;
  gradientId: string;
}
export const Gradients: React.FC<GradientProps> = (options) => {
  const pureLight = new Color(255, 255, 255);

  const createGradients = (data: any): any => {
    const gradients = [];
    const pureLight = new Color(255, 255, 255);
    for (let i = 0; i < data.length; i++) {
      const aColorStart = new Color(0, 0, 0);
      // color can be in hex or in rgb
      let useColor: string = data[i].color;
      if (useColor.startsWith('rgba')) {
        useColor = Color.RGBAToHex(useColor);
      }
      aColorStart.fromHex(useColor);
      const aColorEnd = aColorStart.Mul(pureLight, 0.7);
      gradients.push({ start: aColorStart.asHex(), end: aColorEnd.asHex() });
    }
    return gradients;
  };
  const colorGradients = createGradients(options.data);
  const okColorStart = DEFAULT_OK_COLOR; // '#299c46', // "rgba(50, 172, 45, 1)", // green
  const okColorEnd = okColorStart.Mul(pureLight, 0.7);
  const warningColorStart = DEFAULT_WARNING_COLOR; // #FFC837 // '#e5ac0e', // "rgba(237, 129, 40, 1)", // yellow
  const warningColorEnd = warningColorStart.Mul(pureLight, 0.7);
  const criticalColorStart = DEFAULT_CRITICAL_COLOR; // #e52d27 // '#bf1b00', // "rgba(245, 54, 54, 1)", // red
  const criticalColorEnd = criticalColorStart.Mul(pureLight, 0.7);

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
          <stop offset={'0%'} stopColor={okColorStart.asHex()} />
          <stop offset={'100%'} stopColor={okColorEnd.asHex()} />
        </linearGradient>
        <linearGradient id={gradientId + '_linear_gradient_state_warning'} x1={'30%'} y1={'30%'} x2={'70%'} y2={'70%'}>
          <stop offset={'0%'} stopColor={warningColorStart.asHex()} />
          <stop offset={'100%'} stopColor={warningColorEnd.asHex()} />
        </linearGradient>
        <linearGradient id={gradientId + '_linear_gradient-state_critical'} x1={'30%'} y1={'30%'} x2={'70%'} y2={'70%'}>
          <stop offset={'0%'} stopColor={criticalColorStart.asHex()} />
          <stop offset={'100%'} stopColor={criticalColorEnd.asHex()} />
        </linearGradient>
        <linearGradient id={gradientId + '_linear_gradient_state_unknown'} x1={'30%'} y1={'30%'} x2={'70%'} y2={'70%'}>
          <stop offset={'0%'} stopColor={'#73808A'} />
          <stop offset={'100%'} stopColor={'#73808A'} />
        </linearGradient>
      </defs>
    </>
  );
};
