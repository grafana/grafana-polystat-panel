import {
  COMPOSITE_DISPLAY_MODE_ALL,
  COMPOSITE_DISPLAY_MODE_TRIGGERED,
  DEFAULT_COMPOSITE_TIMESTAMP_FORMAT,
} from '../core/constants';
import { CompositeItemType, CompositeMetric } from '../core/types';
import { AngularSavedComposites } from './types';

export interface CompositeMigrationResult {
  compositeConfig: {
    composites: CompositeItemType[];
    enabled: boolean;
    animationSpeed: string;
  };
}

export const migrateComposites = (
  angular: AngularSavedComposites,
  animationSpeed: string
): CompositeMigrationResult => {
  const options: CompositeMigrationResult = {
    compositeConfig: {
      composites: [],
      enabled: true,
      animationSpeed,
    },
  };

  if (angular.savedComposites?.length) {
    let index = 0;
    for (const composite of angular.savedComposites) {
      const aComposite: CompositeItemType = {
        name: `COMPOSITE-${index}`,
        label: `COMPOSITE-${index}`,
        order: index,
        isTemplated: false,
        displayMode: COMPOSITE_DISPLAY_MODE_ALL,
        enabled: true,
        showName: true,
        showValue: true,
        showComposite: true,
        showMembers: false,
        showTimestampEnabled: false,
        showTimestampFormat: DEFAULT_COMPOSITE_TIMESTAMP_FORMAT,
        showTimestampYOffset: 0,
        metrics: [],
        clickThrough: '',
        clickThroughSanitize: true,
        clickThroughOpenNewTab: true,
        clickThroughCustomTargetEnabled: false,
        clickThroughCustomTarget: '',
      };
      index++;

      for (const p of Object.keys(composite)) {
        const v = composite[p as keyof typeof composite];
        switch (p) {
          case '$$hashKey':
            break;
          case 'animateMode':
            if (v !== COMPOSITE_DISPLAY_MODE_ALL) {
              aComposite.displayMode = COMPOSITE_DISPLAY_MODE_TRIGGERED;
            }
            break;
          case 'clickThrough':
            aComposite.clickThrough = v as string;
            break;
          case 'compositeName':
            aComposite.name = v as string;
            break;
          case 'displayName':
            break;
          case 'enabled':
            aComposite.showComposite = v as boolean;
            break;
          case 'hideMembers':
            aComposite.showMembers = !(v as boolean);
            break;
          case 'label':
            aComposite.label = v as string;
            break;
          case 'members': {
            let memberIndex = 0;
            const members: CompositeMetric[] = [];
            for (const aMember of Object.keys(v as object)) {
              const x = (v as any)[aMember];
              const member: CompositeMetric = {
                seriesMatch: x.seriesName,
                order: memberIndex,
              };
              members.push(member);
              memberIndex++;
            }
            aComposite.metrics = members;
            break;
          }
          case 'newTabEnabled':
            aComposite.clickThroughOpenNewTab = v as boolean;
            break;
          case 'sanitizeURLEnabled':
            aComposite.clickThroughSanitize = v as boolean;
            break;
          case 'sanitizedURL':
            break;
          case 'showName':
            aComposite.showName = v as boolean;
            break;
          case 'showValue':
            aComposite.showValue = v as boolean;
            break;
          default:
            console.log('Ignore composite migration:', p, v);
        }
      }
      options.compositeConfig.composites.push(aComposite);
    }
  }

  return options;
};
