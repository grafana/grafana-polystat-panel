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
});
