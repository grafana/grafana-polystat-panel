import { PolystatModel } from '../components/types';

/**
 * Builds a PolystatModel without going through a DataFrame, for tests that need to control
 * individual fields. Defaults are neutral — override whatever the test is about.
 */
export const createPolystatModel = (overrides: Partial<PolystatModel> = {}): PolystatModel => ({
  displayMode: 'all',
  thresholdLevel: 0,
  value: 0,
  valueFormatted: '0',
  valueRounded: 0,
  stats: {},
  name: 'metric',
  displayName: 'metric',
  timestamp: Date.now(),
  timestampFormatted: '',
  prefix: '',
  suffix: '',
  color: '#000000',
  clickThrough: '',
  operatorName: 'mean',
  newTabEnabled: false,
  customClickthroughTargetEnabled: false,
  customClickthroughTarget: '',
  sanitizedURL: '',
  sanitizeURLEnabled: false,
  showName: true,
  showValue: true,
  showTimestamp: false,
  isComposite: false,
  members: [],
  ...overrides,
});
