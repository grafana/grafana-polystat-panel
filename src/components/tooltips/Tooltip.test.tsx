import React from 'react';
import { render, screen } from '@testing-library/react';

import { FontFamilies, SortOptions } from '../types';
import { ApplyComposites } from '../../data/composite_processor';

import { Tooltip, TooltipProps } from './Tooltip';

import {
  modelA,
  modelB,
  modelC,
  numericalModelA,
  numericalModelB,
  numericalModelC,
  casedModelA,
  casedModelB,
  casedModelC,
} from '../../__mocks__/models/models';
import { compositeA, compositeB, compositeC } from '../../__mocks__/models/composites';

describe('Test Tooltips', () => {
  let renderTime: Date;
  let props: TooltipProps;
  let timeZone = 'utc';
  beforeAll(() => {
    renderTime = new Date('01 October 2022 10:28 UTC');
    props = {
      data: undefined,
      valueEnabled: true,
      tooltipColumnHeadersEnabled: true,
      renderTime: renderTime,
      showTime: true,
      primarySortByField: 'threshold',
      primarySortDirection: 0,
      secondarySortByField: 'value',
      secondarySortDirection: 0,
      displayMode: 'all',
      tooltipDisplayTextTriggeredEmpty: 'EMPTY',
      tooltipFontFamily: FontFamilies.INTER,
    };
  });

  /*
  beforeEach(() => {
  });
  */

  describe('Tooltip Sorting', () => {
    it('returns unsorted metrics', () => {
      const applied = ApplyComposites([compositeA], [modelA, modelB, modelC], (val) => val, false, timeZone);
      const props: TooltipProps = {
        data: applied[0],
        valueEnabled: true,
        tooltipColumnHeadersEnabled: true,
        renderTime: renderTime,
        showTime: true,
        primarySortByField: 'name',
        primarySortDirection: SortOptions[0].value,
        secondarySortByField: 'value',
        secondarySortDirection: SortOptions[0].value,
        displayMode: 'all',
        tooltipDisplayTextTriggeredEmpty: 'EMPTY',
        tooltipFontFamily: FontFamilies.INTER,
      };
      render(<Tooltip {...props} />);
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(6);
      expect(rows[0].innerHTML).toContain('composite-a');
      expect(rows[2].innerHTML).toContain('2022-10-01 10:28:00');
      expect(rows[3].innerHTML).toContain('A-series');
      expect(rows[4].innerHTML).toContain('B-series');
      expect(rows[5].innerHTML).toContain('C-series');
    });
    it('returns primary sorted metrics: case sensitive ascending', () => {
      const applied = ApplyComposites([compositeA], [modelA, modelB, modelC], (val) => val, false, timeZone);
      const props: TooltipProps = {
        data: applied[0],
        valueEnabled: true,
        tooltipColumnHeadersEnabled: true,
        renderTime: renderTime,
        showTime: true,
        primarySortByField: 'name',
        primarySortDirection: SortOptions[1].value,
        secondarySortByField: 'value',
        secondarySortDirection: SortOptions[0].value,
        displayMode: 'all',
        tooltipDisplayTextTriggeredEmpty: 'EMPTY',
        tooltipFontFamily: FontFamilies.INTER,
      };
      render(<Tooltip {...props} />);
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(6);
      expect(rows[0].innerHTML).toContain('composite-a');
      expect(rows[2].innerHTML).toContain('2022-10-01 10:28:00');
      expect(rows[3].innerHTML).toContain('A-series');
      expect(rows[4].innerHTML).toContain('B-series');
      expect(rows[5].innerHTML).toContain('C-series');
    });

    it('returns primary sorted metrics: case sensitive descending', () => {
      const applied = ApplyComposites([compositeA], [modelA, modelB, modelC], (val) => val, false, timeZone);
      const props: TooltipProps = {
        data: applied[0],
        valueEnabled: true,
        tooltipColumnHeadersEnabled: true,
        renderTime: renderTime,
        showTime: true,
        primarySortByField: 'name',
        primarySortDirection: SortOptions[2].value,
        secondarySortByField: 'value',
        secondarySortDirection: SortOptions[0].value,
        displayMode: 'all',
        tooltipDisplayTextTriggeredEmpty: 'EMPTY',
        tooltipFontFamily: FontFamilies.INTER,
      };
      render(<Tooltip {...props} />);
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(6);
      expect(rows[0].innerHTML).toContain('composite-a');
      expect(rows[2].innerHTML).toContain('2022-10-01 10:28:00');
      expect(rows[3].innerHTML).toContain('C-series');
      expect(rows[4].innerHTML).toContain('B-series');
      expect(rows[5].innerHTML).toContain('A-series');
    });

    it('returns primary sorted metrics: numerical ascending', () => {
      let internalData = [numericalModelA, numericalModelB, numericalModelC];
      internalData = ApplyComposites([compositeC], internalData, (val) => val, false, timeZone);
      const props: TooltipProps = {
        data: internalData[0],
        valueEnabled: true,
        tooltipColumnHeadersEnabled: true,
        renderTime: renderTime,
        showTime: true,
        primarySortByField: 'name',
        primarySortDirection: SortOptions[3].value,
        secondarySortByField: 'value',
        secondarySortDirection: SortOptions[0].value,
        displayMode: 'all',
        tooltipDisplayTextTriggeredEmpty: 'EMPTY',
        tooltipFontFamily: FontFamilies.INTER,
      };
      render(<Tooltip {...props} />);
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(6);
      expect(rows[0].innerHTML).toContain('composite-numerical');
      expect(rows[2].innerHTML).toContain('2022-10-01 10:28:00');
      expect(rows[3].innerHTML).toContain('01');
      expect(rows[4].innerHTML).toContain('02');
      expect(rows[5].innerHTML).toContain('03');
    });

    it('returns primary sorted metrics: numerical descending', () => {
      let internalData = [numericalModelA, numericalModelB, numericalModelC];
      internalData = ApplyComposites([compositeC], internalData, (val) => val, false, timeZone);
      const props: TooltipProps = {
        data: internalData[0],
        valueEnabled: true,
        tooltipColumnHeadersEnabled: true,
        renderTime: renderTime,
        showTime: true,
        primarySortByField: 'name',
        primarySortDirection: SortOptions[4].value,
        secondarySortByField: 'value',
        secondarySortDirection: SortOptions[0].value,
        displayMode: 'all',
        tooltipDisplayTextTriggeredEmpty: 'EMPTY',
        tooltipFontFamily: FontFamilies.INTER,
      };
      render(<Tooltip {...props} />);
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(6);
      expect(rows[0].innerHTML).toContain('composite-numerical');
      expect(rows[2].innerHTML).toContain('2022-10-01 10:28:00');
      expect(rows[3].innerHTML).toContain('03');
      expect(rows[4].innerHTML).toContain('02');
      expect(rows[5].innerHTML).toContain('01');
    });

    it('returns primary sorted metrics: case insensitive ascending', () => {
      const applied = ApplyComposites([compositeA], [casedModelA, casedModelB, casedModelC], (val) => val, false, timeZone);
      const props: TooltipProps = {
        data: applied[0],
        valueEnabled: true,
        tooltipColumnHeadersEnabled: true,
        renderTime: renderTime,
        showTime: true,
        primarySortByField: 'name',
        primarySortDirection: SortOptions[5].value,
        secondarySortByField: 'value',
        secondarySortDirection: SortOptions[0].value,
        displayMode: 'all',
        tooltipDisplayTextTriggeredEmpty: 'EMPTY',
        tooltipFontFamily: FontFamilies.INTER,
      };
      render(<Tooltip {...props} />);
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(6);
      expect(rows[0].innerHTML).toContain('composite-a');
      expect(rows[2].innerHTML).toContain('2022-10-01 10:28:00');
      expect(rows[3].innerHTML).toContain('series-a1');
      expect(rows[4].innerHTML).toContain('series-A2');
      expect(rows[5].innerHTML).toContain('series-a3');
    });

    it('returns primary sorted metrics: case insensitive descending', () => {
      const applied = ApplyComposites([compositeA], [casedModelA, casedModelB, casedModelC], (val) => val, false, timeZone);
      const props: TooltipProps = {
        data: applied[0],
        valueEnabled: true,
        tooltipColumnHeadersEnabled: true,
        renderTime: renderTime,
        showTime: true,
        primarySortByField: 'name',
        primarySortDirection: SortOptions[6].value,
        secondarySortByField: 'value',
        secondarySortDirection: SortOptions[0].value,
        displayMode: 'all',
        tooltipDisplayTextTriggeredEmpty: 'EMPTY',
        tooltipFontFamily: FontFamilies.INTER,
      };
      render(<Tooltip {...props} />);
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(6);
      expect(rows[0].innerHTML).toContain('composite-a');
      expect(rows[2].innerHTML).toContain('2022-10-01 10:28:00');
      expect(rows[3].innerHTML).toContain('series-a3');
      expect(rows[4].innerHTML).toContain('series-A2');
      expect(rows[5].innerHTML).toContain('series-a1');
    });
  });

  describe('Tooltip Generation', () => {
    it('returns tooltip for single metric', () => {
      const applied = ApplyComposites([compositeA], [modelA], (val) => val, false, timeZone);
      const props: TooltipProps = {
        data: applied[0],
        valueEnabled: true,
        tooltipColumnHeadersEnabled: true,
        renderTime: renderTime,
        showTime: true,
        primarySortByField: 'name',
        primarySortDirection: SortOptions[0].value,
        secondarySortByField: 'value',
        secondarySortDirection: SortOptions[0].value,
        displayMode: 'all',
        tooltipDisplayTextTriggeredEmpty: 'EMPTY',
        tooltipFontFamily: FontFamilies.INTER,
      };

      render(<Tooltip {...props} />);
      expect(screen.getByRole('table')).toMatchSnapshot();
    });
    it('returns tooltip for composite metric with one metric', () => {
      const applied = ApplyComposites([compositeA], [modelA], (val) => val, false, timeZone);
      props.data = applied[0];
      render(<Tooltip {...props} />);
      expect(screen.getByRole('table')).toMatchSnapshot();
    });
    it('returns tooltip for composite metric with two metrics', () => {
      const applied = ApplyComposites([compositeA], [modelA, modelB], (val) => val, false, timeZone);
      props.data = applied[0];
      render(<Tooltip {...props} />);
      expect(screen.getByRole('table')).toMatchSnapshot();
    });
    it('returns tooltip for composite metric with three metrics', () => {
      const applied = ApplyComposites([compositeA], [modelA, modelB, modelC], (val) => val, false, timeZone);
      props.data = applied[0];
      render(<Tooltip {...props} />);
      expect(screen.getByRole('table')).toMatchSnapshot();
    });
    it('returns tooltip for composite metric with one triggered metric', () => {
      modelA.thresholdLevel = 0;
      modelB.thresholdLevel = 1;
      modelC.thresholdLevel = 0;
      const applied = ApplyComposites([compositeB], [modelA, modelB, modelC], (val) => val, false, timeZone);
      props.data = applied[0];
      // the displayMode comes from the applied composite, in this case there is one triggered metric
      if (applied[0].displayMode) {
        props.displayMode = applied[0].displayMode;
      }
      render(<Tooltip {...props} />);
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(4);
      expect(rows[0].innerHTML).toContain('composite-b');
      expect(rows[2].innerHTML).toContain('2022-10-01 10:28:00');
      expect(rows[3].innerHTML).toContain('B-series');
    });
  });
});
