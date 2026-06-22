import { PolystatModel, ShowTimestampFormats } from '../components/types';
import { FieldType, InterpolateFunction, ScopedVars, toDataFrame, TypedVariableModel } from '@grafana/data';
import { DataFrameToPolystat } from './processor';
import { getWorstSeries } from './threshold_processor';
import { CompositeItemType } from 'components/composites/types';
import {
  ApplyComposites,
  resolveCompositeTemplates,
  resolveMemberTemplates,
  customFormatter,
} from './composite_processor';
import { getTemplateSrv } from '@grafana/runtime';
import { CUSTOM_SPLIT_DELIMITER } from './types';

jest.mock('@grafana/runtime', () => {
  const original = jest.requireActual('@grafana/runtime');
  return {
    ...original,
    getTemplateSrv: () => ({
      replace: (s: string) => {
        if (s.includes('$project_name')) {
          s = s.replace('$project_name', 'ProjectA');
        }
        if (s.includes('$compositeName')) {
          s = s.replace('$compositeName', 'ProjectA');
        }
        return s;
      },
      getVariables: () => [] as unknown as TypedVariableModel[],
    }),
  };
});

describe('Composite Processor', () => {
  let modelA: PolystatModel;
  let modelB: PolystatModel;
  let compositeA: CompositeItemType;
  let templatedComposite: CompositeItemType;

  beforeEach(() => {
    const time = new Date().getTime();
    const frameA = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'A-series', type: FieldType.number, values: [200, 210, 220] },
      ],
    });
    // operator mean
    modelA = DataFrameToPolystat(frameA, 'mean')[0];
    modelA.operatorName = 'mean';

    const frameB = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [time, time + 1, time + 2] },
        { name: 'B-series', type: FieldType.number, values: [500, 510, 520] },
      ],
    });
    // operator mean
    modelB = DataFrameToPolystat(frameB, 'mean')[0];
    modelB.operatorName = 'mean';

    compositeA = {
      name: 'composite-a',
      label: 'composite-a',
      order: 0,
      isTemplated: false,
      displayMode: 'all',
      enabled: true,
      showName: true,
      showMembers: false,
      showValue: true,
      showComposite: true,
      showTimestampEnabled: false,
      showTimestampFormat: ShowTimestampFormats[0].value,
      showTimestampYOffset: 0,
      clickThrough: '',
      clickThroughOpenNewTab: true,
      clickThroughSanitize: true,
      clickThroughCustomTargetEnabled: false,
      clickThroughCustomTarget: '',
      metrics: [
        {
          seriesMatch: '/series/',
          order: 0,
        },
      ],
    };

    templatedComposite = {
      name: '$project_name',
      label: 'Templated Composite',
      order: 0,
      isTemplated: true,
      displayMode: 'all',
      enabled: true,
      showName: true,
      showMembers: false,
      showValue: true,
      showComposite: true,
      showTimestampEnabled: false,
      showTimestampFormat: ShowTimestampFormats[0].value,
      showTimestampYOffset: 0,
      clickThrough: '',
      clickThroughOpenNewTab: true,
      clickThroughSanitize: true,
      clickThroughCustomTargetEnabled: false,
      clickThroughCustomTarget: '',
      metrics: [
        {
          seriesMatch: '/API - $compositeName/',
          order: 0,
        },
      ],
    };
  });

  describe('Gets Worst Series A (no thresholds set)', () => {
    it('returns A-series as worst', () => {
      const worst = getWorstSeries(modelA, modelB);
      console.log(JSON.stringify(worst));
      expect(worst.name).toBe(modelA.name);
    });
  });
  describe('Creates composite result', () => {
    it('returns an applied composite', () => {
      const replacer1: InterpolateFunction = (value: string, scopedVars?: ScopedVars, format?: string | Function) => {
        scopedVars = {
          serverA: { text: 'serverAText', value: 'serverAValue' },
          serverB: { text: 'serverBText', value: 'serverBValue' },
        };
        return value;
      };
      const applied = ApplyComposites([compositeA], [modelA, modelB], replacer1, false, 'utc');
      console.log(JSON.stringify(applied));
      expect(applied.length).toBe(1);
    });
  });
  describe('Creates composite with template variables expanded', () => {
    it('returns a composite named by template variable', () => {
      const resolved = resolveCompositeTemplates([templatedComposite], getTemplateSrv().replace);
      console.log(JSON.stringify(resolved));
      expect(resolved[0].name).toEqual('ProjectA');
    });
  });
  describe('Creates composite with template variables expanded and metrics substituted', () => {
    it('returns a composite named by template variable and metrics substituted', () => {
      const composites = resolveCompositeTemplates([templatedComposite], getTemplateSrv().replace);
      console.log(JSON.stringify(composites));
      expect(composites[0].name).toEqual('ProjectA');
      const templatedMembers = resolveMemberTemplates(
        composites[0].name,
        composites[0].metrics,
        getTemplateSrv().replace
      );
      console.log(JSON.stringify(templatedMembers));
      expect(templatedMembers[0].seriesName).toEqual('/API - ProjectA/');
    });
  });
  describe('Composite clickthrough transforms', () => {
    const identityReplace: InterpolateFunction = (value: string) => value;

    it('replaces ${__composite_name} in clickthrough', () => {
      const compositeWithClick: CompositeItemType = {
        ...compositeA,
        clickThrough: '/d/test?composite=${__composite_name}',
      };
      const applied = ApplyComposites([compositeWithClick], [modelA, modelB], identityReplace, false, 'utc');
      const matchedItem = applied.find((m) => m.clickThrough.length > 0);
      expect(matchedItem).toBeDefined();
      expect(matchedItem!.clickThrough).toContain('composite=composite-a');
    });

    it('replaces ${__cell_name} in clickthrough', () => {
      const compositeWithClick: CompositeItemType = {
        ...compositeA,
        clickThrough: '/d/test?name=${__cell_name}',
      };
      const applied = ApplyComposites([compositeWithClick], [modelA, modelB], identityReplace, false, 'utc');
      const matchedItems = applied.filter((m) => m.clickThrough.includes('/d/test?name='));
      expect(matchedItems.length).toBeGreaterThan(0);
      expect(matchedItems[0].clickThrough).not.toContain('${__cell_name}');
    });

    it('replaces nth metric placeholders in clickthrough', () => {
      const compositeWithClick: CompositeItemType = {
        ...compositeA,
        clickThrough: '/d/test?name0=${__cell_name_0}&name1=${__cell_name_1}',
      };
      const applied = ApplyComposites([compositeWithClick], [modelA, modelB], identityReplace, false, 'utc');
      const matchedItem = applied.find((m) => m.clickThrough.includes('/d/test?'));
      expect(matchedItem).toBeDefined();
      expect(matchedItem!.clickThrough).toContain('name0=A-series');
      expect(matchedItem!.clickThrough).toContain('name1=B-series');
    });

    it('sets clickthrough side-effect properties', () => {
      const compositeWithClick: CompositeItemType = {
        ...compositeA,
        clickThrough: '/d/test',
        clickThroughCustomTargetEnabled: true,
        clickThroughCustomTarget: '_blank',
      };
      const applied = ApplyComposites([compositeWithClick], [modelA, modelB], identityReplace, false, 'utc');
      const matchedItem = applied.find((m) => m.clickThrough === '/d/test');
      expect(matchedItem).toBeDefined();
      expect(matchedItem!.sanitizedURL).toBeDefined();
      expect(matchedItem!.customClickthroughTargetEnabled).toBe(true);
      expect(matchedItem!.customClickthroughTarget).toBe('_blank');
    });

    it('combines composite name, single, and nth transforms', () => {
      const compositeWithClick: CompositeItemType = {
        ...compositeA,
        clickThrough: '/d/test?comp=${__composite_name}&cell=${__cell_name}&nth=${__cell_name_0}',
      };
      const applied = ApplyComposites([compositeWithClick], [modelA, modelB], identityReplace, false, 'utc');
      const matchedItem = applied.find((m) => m.clickThrough.includes('/d/test?'));
      expect(matchedItem).toBeDefined();
      expect(matchedItem!.clickThrough).toContain('comp=composite-a');
      expect(matchedItem!.clickThrough).toContain('nth=A-series');
      expect(matchedItem!.clickThrough).not.toContain('${__composite_name}');
      expect(matchedItem!.clickThrough).not.toContain('${__cell_name}');
      expect(matchedItem!.clickThrough).not.toContain('${__cell_name_0}');
    });
  });

  describe('Custom Formatter returns expected data', () => {
    it('returns string unchanged', () => {
      const formatted = customFormatter('MetricA');
      console.log(JSON.stringify(formatted));
      expect(formatted).toEqual('MetricA');
    });
    it('returns joined array with custom delimiter', () => {
      const formatted = customFormatter(['MetricA', 'MetricB']);
      console.log(JSON.stringify(formatted));
      expect(formatted).toEqual('MetricA' + CUSTOM_SPLIT_DELIMITER + 'MetricB');
    });
  });
});
