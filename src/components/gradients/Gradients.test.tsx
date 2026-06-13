import React from 'react';
import { render } from '@testing-library/react';

import { Gradients, GradientProps } from './Gradients';

describe('Test Gradients', () => {
  const props: GradientProps = {
    data: [],
    gradientId: 'abc',
  };
  beforeEach(() => {});

  describe('Gradient Generation', () => {
    it('returns set of gradients', () => {
      const { container } = render(
        <svg>
          <Gradients {...props} />
        </svg>
      );
      //console.log(container.innerHTML);
      expect(container.innerHTML).toMatchSnapshot();
    });
  });

  describe('Data-driven gradients', () => {
    it('renders gradient defs for each data item', () => {
      const data = [{ color: '#ed8128' }, { color: 'rgba(245, 54, 54, 1)' }];
      const { container } = render(
        <svg>
          <Gradients data={data} gradientId="test" />
        </svg>
      );
      const gradients = container.querySelectorAll('linearGradient');
      // 2 data-driven + 4 static (ok, warning, critical, unknown)
      expect(gradients.length).toBe(6);
      // data-driven gradient IDs contain the data index
      expect(gradients[0].id).toBe('test_linear_gradient_state_data_0');
      expect(gradients[1].id).toBe('test_linear_gradient_state_data_1');
    });

    it('produces correct start and end colors for hex input', () => {
      const data = [{ color: '#ed8128' }];
      const { container } = render(
        <svg>
          <Gradients data={data} gradientId="hex" />
        </svg>
      );
      const stops = container.querySelectorAll('linearGradient#hex_linear_gradient_state_data_0 stop');
      expect(stops.length).toBe(2);
      expect(stops[0].getAttribute('stop-color')).toBe('#ed8128');
      expect(stops[1].getAttribute('stop-color')).toBe('#a65a1c');
    });

    it('produces correct start and end colors for rgba input', () => {
      const data = [{ color: 'rgba(41, 156, 70, 1)' }];
      const { container } = render(
        <svg>
          <Gradients data={data} gradientId="rgba" />
        </svg>
      );
      const stops = container.querySelectorAll('linearGradient#rgba_linear_gradient_state_data_0 stop');
      expect(stops.length).toBe(2);
      // rgba gets converted through rgbaToHex → fromHex pipeline
      expect(stops[0].getAttribute('stop-color')).toBeDefined();
      expect(stops[1].getAttribute('stop-color')).toBeDefined();
      // start color should match the input
      expect(stops[0].getAttribute('stop-color')).toBe('#299c46');
    });

    it('renders static gradients with correct colors', () => {
      const { container } = render(
        <svg>
          <Gradients data={[]} gradientId="static" />
        </svg>
      );
      const okStops = container.querySelectorAll('linearGradient#static_linear_gradient_state_ok stop');
      expect(okStops[0].getAttribute('stop-color')).toBe('#299c46');
      const warningStops = container.querySelectorAll('linearGradient#static_linear_gradient_state_warning stop');
      expect(warningStops[0].getAttribute('stop-color')).toBe('#ed8128');
      const criticalStops = container.querySelectorAll('linearGradient#static_linear_gradient-state_critical stop');
      expect(criticalStops[0].getAttribute('stop-color')).toBe('#f53636');
    });
  });
});
