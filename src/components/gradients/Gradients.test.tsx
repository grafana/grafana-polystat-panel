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
    it('renders one gradient per data item', () => {
      const data = [
        { color: '#ed8128' },
        { color: 'rgba(245, 54, 54, 1)' },
      ];
      const { container } = render(
        <svg>
          <Gradients data={data} gradientId="test" />
        </svg>
      );
      const gradients = container.querySelectorAll('linearGradient');
      expect(gradients.length).toBe(2);
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
      // rgba gets converted through normalizeToHex → darken pipeline
      expect(stops[0].getAttribute('stop-color')).toBeDefined();
      expect(stops[1].getAttribute('stop-color')).toBeDefined();
      // start color should match the input
      expect(stops[0].getAttribute('stop-color')).toBe('#299c46');
    });
  });
});
