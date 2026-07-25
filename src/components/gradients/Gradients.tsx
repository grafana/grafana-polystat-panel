import React, { useMemo } from 'react';

import { normalizeToHex, darken } from './color';

const DARKEN_FACTOR = 0.7;

export interface GradientProps {
  data: any;
  gradientId: string;
}
export const Gradients: React.FC<GradientProps> = (options) => {
  const colorGradients = useMemo(() => {
    // color can be in hex or in rgb(a)
    return options.data.map((item: any) => {
      const startHex = normalizeToHex(item.color);
      return { start: startHex, end: darken(startHex, DARKEN_FACTOR) };
    });
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
      </defs>
    </>
  );
};
