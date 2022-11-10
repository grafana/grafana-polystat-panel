import { CompositeItemType } from '../../components/composites/types';

export const compositeA: CompositeItemType = {
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
  clickThrough: '',
  clickThroughOpenNewTab: true,
  clickThroughSanitize: true,
  metrics: [
    {
      seriesMatch: '/series/',
      order: 0,
    },
  ],
};

export const compositeB: CompositeItemType = {
  name: 'composite-b',
  label: 'composite-b',
  order: 0,
  isTemplated: false,
  displayMode: 'triggered',
  enabled: true,
  showName: true,
  showMembers: false,
  showValue: true,
  showComposite: true,
  clickThrough: '',
  clickThroughOpenNewTab: true,
  clickThroughSanitize: true,
  metrics: [
    {
      seriesMatch: '/series/',
      order: 0,
    },
  ],
};

export const compositeC: CompositeItemType = {
  name: 'composite-numerical',
  label: 'composite-numerical',
  order: 0,
  isTemplated: false,
  displayMode: 'all',
  enabled: true,
  showName: true,
  showMembers: false,
  showValue: true,
  showComposite: true,
  clickThrough: '',
  clickThroughOpenNewTab: true,
  clickThroughSanitize: true,
  metrics: [
    {
      seriesMatch: '/\\d+/',
      order: 0,
    },
  ],
};
