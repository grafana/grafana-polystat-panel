import { PolystatModel } from '../components/types';

// fixtures share one fixed instant so anything rendering a timestamp stays deterministic
export const FIXTURE_TIMESTAMP = new Date('01 October 2022 10:28 UTC').getTime();

/**
 * Builds a PolystatModel without going through a DataFrame, for tests that need to set
 * individual fields. Defaults are neutral, override whatever the test is about.
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
  timestamp: FIXTURE_TIMESTAMP,
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
