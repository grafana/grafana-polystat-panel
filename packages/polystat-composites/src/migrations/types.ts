export interface CompositeMembers {
  seriesName: string;
}

export interface LegacyCompositeItem {
  animateMode: string;
  clickThrough: string;
  compositeName: string;
  displayName: string;
  enabled: boolean;
  hideMembers: boolean;
  label: string;
  members: CompositeMembers[];
  newTabEnabled: boolean;
  sanitizeURLEnabled: boolean;
  sanitizedURL: string;
  showName: boolean;
  showValue: boolean;
  thresholdLevel: number;
}

export interface AngularSavedComposites {
  savedComposites: LegacyCompositeItem[];
}
