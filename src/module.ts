import { FieldConfigProperty, PanelPlugin } from '@grafana/data';

import {
  DisplayModes,
  FontFamilyOptions,
  FontFamilyOptionsLegacy,
  OperatorOptions,
  PolygonNamedShapes,
  PolystatOptions,
  ShowTimestampFormats,
  ShowTimestampPositions,
  SortByFieldOptions,
  SortOptions,
} from './components/types';
import { CompositeItemType } from './components/composites/types';
import { OverrideEditor } from './components/overrides/OverrideEditor';
import { OverrideItemType } from './components/overrides/types';
import { PolystatPanel } from './components/PolystatPanel';
import {
  GLOBAL_FILL_COLOR_RGBA,
  GLOBAL_BORDER_COLOR_RGBA,
  GLOBAL_DISPLAY_TEXT_TRIGGERED_EMPTY,
  GLOBAL_TEXT_FONT_FAMILY,
  GLOBAL_TOOLTIP_FONT_FAMILY,
  GLOBAL_TEXT_FONT_FAMILY_LEGACY,
  GLOBAL_TOOLTIP_FONT_FAMILY_LEGACY,
} from './components/defaults';
import { CompositeEditor } from './components/composites/CompositeEditor';
import { PolystatThreshold } from './components/thresholds/types';
import { GlobalThresholdEditor } from './components/thresholds/GlobalThresholdEditor';
import { PolystatDataSuggestionsSupplier } from './components/suggestions';
import { hasRobotoFont, PolystatPanelMigrationHandler } from './migrations';


export const plugin = new PanelPlugin<PolystatOptions>(PolystatPanel)
  .setMigrationHandler(PolystatPanelMigrationHandler)
  .useFieldConfig({
    disableStandardOptions: [
      FieldConfigProperty.Thresholds,
      FieldConfigProperty.Color,
      FieldConfigProperty.Decimals,
      FieldConfigProperty.DisplayName,
      FieldConfigProperty.Max,
      FieldConfigProperty.Min,
      FieldConfigProperty.Links,
      FieldConfigProperty.NoValue,
      FieldConfigProperty.Unit,
    ],
    standardOptions: {
      [FieldConfigProperty.Mappings]: {},
    },
  })
  .setPanelOptions((builder) => {
    builder
      .addBooleanSwitch({
        name: 'Auto Size Columns',
        path: 'autoSizeColumns',
        defaultValue: true,
        category: ['Layout'],
        description: 'Automatically set columns based on panel size',
      })
      .addNumberInput({
        path: 'layoutNumColumns',
        name: 'Columns',
        description: 'Use specific number of columns',
        defaultValue: 8,
        settings: {
          placeHolder: '8',
          min: 1,
          integer: true,
        },
        category: ['Layout'],
        showIf: (c) => !c.autoSizeColumns,
      })
      .addBooleanSwitch({
        name: 'Auto Size Rows',
        path: 'autoSizeRows',
        defaultValue: true,
        category: ['Layout'],
        description: 'Automatically set rows based on panel size',
      })
      .addNumberInput({
        path: 'layoutNumRows',
        name: 'Rows',
        description: 'Use specific number of rows',
        defaultValue: 8,
        settings: {
          placeHolder: '8',
          min: 1,
          integer: true,
        },
        category: ['Layout'],
        showIf: (c) => !c.autoSizeRows,
      })
      .addNumberInput({
        path: 'layoutDisplayLimit',
        name: 'Display Limit',
        description: 'Maximum number of polygons to display (0 for unlimited)',
        defaultValue: 100,
        settings: {
          min: 0,
          integer: true,
        },
        category: ['Layout'],
      })

      .addBooleanSwitch({
        name: 'Auto Size Polygons',
        path: 'autoSizePolygons',
        defaultValue: true,
        category: ['Sizing'],
        description: 'Automatically sets size of polygon for best fit',
      })
      .addTextInput({
        name: 'Polygon Size in pixels',
        path: 'globalPolygonSize',
        description: 'Use specific size for polygons',
        defaultValue: '25',
        settings: {
          placeHolder: 'Auto',
        },
        category: ['Sizing'],
        showIf: (c) => !c.autoSizePolygons,
      })
      .addNumberInput({
        name: 'Border Size',
        path: 'globalPolygonBorderSize',
        description: 'Border size for each polygon',
        defaultValue: 2,
        settings: {
          min: 0,
        },
        category: ['Sizing'],
      })
      // font selection
      .addSelect({
        path: 'globalTextFontFamily',
        name: 'Font Family',
        description: 'Font used for rendered text',
        category: ['Text'],
        defaultValue: GLOBAL_TEXT_FONT_FAMILY,
        settings: {
          options: FontFamilyOptions,
        },
        showIf: () => !hasRobotoFont(),
      })
      .addSelect({
        path: 'globalTextFontFamily',
        name: 'Font Family',
        description: 'Font used for rendered text',
        category: ['Text'],
        defaultValue: GLOBAL_TEXT_FONT_FAMILY_LEGACY,
        settings: {
          options: FontFamilyOptionsLegacy,
        },
        showIf: () => hasRobotoFont(),
      })
      .addBooleanSwitch({
        name: 'Auto Scale Fonts',
        path: 'globalAutoScaleFonts',
        defaultValue: true,
        category: ['Text'],
        description: 'Automatically sets label and value font size based on size of polygon',
      })
      .addNumberInput({
        name: 'Label Font Size',
        path: 'globalLabelFontSize',
        defaultValue: 12,
        settings: {
          min: 0,
        },
        category: ['Text'],
        description: 'Label font size',
        showIf: (c) => !c.globalAutoScaleFonts,
      })
      .addNumberInput({
        name: 'Value Font Size',
        path: 'globalValueFontSize',
        defaultValue: 14,
        settings: {
          min: 0,
        },
        category: ['Text'],
        description: 'Value font size',
        showIf: (c) => !c.globalAutoScaleFonts,
      })
      .addNumberInput({
        name: 'Composite Value Font Size',
        path: 'globalCompositeValueFontSize',
        defaultValue: 14,
        settings: {
          min: 0,
        },
        category: ['Text'],
        description: 'Composite Value font size',
        showIf: (c) => !c.globalAutoScaleFonts,
      })
      // font color
      // auto set font color
      .addBooleanSwitch({
        name: 'Automate Font Color',
        path: 'globalTextFontAutoColorEnabled',
        defaultValue: true,
        category: ['Text'],
        description: 'Sets font color to match theme',
      })
      .addColorPicker({
        name: 'Font Color',
        path: 'globalTextFontColor',
        category: ['Text'],
        defaultValue: '#000000',
        description: 'Font color to use for all text on polygon',
        showIf: (c) => !c.globalTextFontAutoColorEnabled,
      })

      // ellipse enabled
      .addBooleanSwitch({
        name: 'Use Ellipses',
        path: 'ellipseEnabled',
        defaultValue: false,
        category: ['Text'],
        description: 'Use Ellipses when character count is exceeded',
        showIf: (c) => !c.globalAutoScaleFonts,
      })
      // ellipse num chars
      .addNumberInput({
        name: 'Ellipse Characters',
        path: 'ellipseCharacters',
        defaultValue: 18,
        settings: {
          min: 0,
          integer: true,
        },
        category: ['Text'],
        description: 'Default number of characters to display before showing ellipses',
        showIf: (c) => c.ellipseEnabled && !c.globalAutoScaleFonts,
      })

      // Sorting
      .addSelect({
        path: 'sortByDirection',
        name: 'Sort By Direction',
        description: 'Direction of sorting by the specified field',
        category: ['Sorting'],
        defaultValue: 1,
        settings: {
          options: SortOptions,
        },
      })
      .addSelect({
        path: 'sortByField',
        name: 'Sort By Field',
        description: 'Which field should be used for sorting',
        defaultValue: 'name',
        category: ['Sorting'],
        settings: {
          options: SortByFieldOptions,
        },
      })

      // tooltips
      .addBooleanSwitch({
        name: 'Enable Tooltips',
        path: 'globalTooltipsEnabled',
        defaultValue: true,
        category: ['Tooltips'],
        description: 'Provides tooltips for each polygon',
      })
      .addSelect({
        path: 'globalTooltipsFontFamily',
        name: 'Font Family',
        description: 'Font used for tooltip text',
        category: ['Tooltips'],
        defaultValue: GLOBAL_TOOLTIP_FONT_FAMILY,
        settings: {
          options: FontFamilyOptions,
        },
        showIf: () => !hasRobotoFont(),
      })
      .addSelect({
        path: 'globalTooltipsFontFamily',
        name: 'Font Family',
        description: 'Font used for tooltip text',
        category: ['Tooltips'],
        defaultValue: GLOBAL_TOOLTIP_FONT_FAMILY_LEGACY,
        settings: {
          options: FontFamilyOptionsLegacy,
        },
        showIf: () => hasRobotoFont(),
      })
      .addBooleanSwitch({
        name: 'Show Timestamp',
        path: 'globalTooltipsShowTimestampEnabled',
        defaultValue: true,
        category: ['Tooltips'],
        description: 'Show timestamp at bottom of tooltip',
      })
      .addBooleanSwitch({
        name: 'Show Value',
        path: 'globalTooltipsShowValueEnabled',
        defaultValue: true,
        category: ['Tooltips'],
        description: 'Show values in tooltip',
      })
      // show tooltip column headers
      .addBooleanSwitch({
        name: 'Show Column Headers',
        path: 'globalShowTooltipColumnHeadersEnabled',
        defaultValue: true,
        category: ['Tooltips'],
        description: 'Show Column headers on tooltip'
      })
      // display modes
      .addSelect({
        path: 'tooltipDisplayMode',
        name: 'Display Mode',
        description: 'Show either all metrics/composites or only triggered',
        defaultValue: 'all',
        category: ['Tooltips'],
        settings: {
          options: DisplayModes,
        },
      })
      .addTextInput({
        path: 'tooltipDisplayTextTriggeredEmpty',
        name: 'Non Triggered State Text',
        description:
          'Text to be displayed by tooltip when there are no triggered thresholds and tooltip display mode is set to triggered',
        defaultValue: GLOBAL_DISPLAY_TEXT_TRIGGERED_EMPTY,
        category: ['Tooltips'],
      })
      // primary sort direction
      .addSelect({
        path: 'tooltipPrimarySortDirection',
        name: 'Primary Sort Direction',
        description: 'Direction of sorting by the specified field',
        category: ['Tooltips'],
        defaultValue: SortOptions[1].value,
        settings: {
          options: SortOptions,
        },
      })
      .addSelect({
        path: 'tooltipPrimarySortByField',
        name: 'Primary Sort By Field',
        description: 'Which field should be used for sorting',
        defaultValue: 'thresholdLevel',
        category: ['Tooltips'],
        settings: {
          options: SortByFieldOptions,
        },
      })

      // secondary sort direction
      .addSelect({
        path: 'tooltipSecondarySortDirection',
        name: 'Secondary Sort Direction',
        description: 'Direction of sorting by the specified field',
        category: ['Tooltips'],
        defaultValue: SortOptions[1].value,
        settings: {
          options: SortOptions,
        },
      })
      .addSelect({
        path: 'tooltipSecondarySortByField',
        name: 'Secondary Sort By Field',
        description: 'Which field should be used for sorting',
        defaultValue: 'value',
        category: ['Tooltips'],
        settings: {
          options: SortByFieldOptions,
        },
      })

      // globals generic
      //
      // display mode
      .addSelect({
        path: 'globalDisplayMode',
        name: 'Display Mode',
        description: 'Show either all metrics/composites or only triggered',
        defaultValue: 'all',
        category: ['Global'],
        settings: {
          options: DisplayModes,
        },
      })
      .addTextInput({
        path: 'globalDisplayTextTriggeredEmpty',
        name: 'Non Triggered State Text',
        description:
          'Text to be displayed in polygon when there are no triggered thresholds and global display mode is set to triggered',
        defaultValue: GLOBAL_DISPLAY_TEXT_TRIGGERED_EMPTY,
        category: ['Global'],
      })

      // show value
      .addBooleanSwitch({
        name: 'Show Value',
        path: 'globalShowValueEnabled',
        defaultValue: true,
        category: ['Global'],
        description: 'Show value on the polygon',
      })

      // displays timestamp on polygons
      .addBooleanSwitch({
        name: 'Show Timestamp',
        path: 'globalShowTimestampEnabled',
        defaultValue: false,
        category: ['Global'],
        description: 'Show timestamp of metric on the polygon',
      })
      .addSelect({
        name: 'Timestamp Format',
        path: 'globalShowTimestampFormat',
        description: 'Format of timestamp to display',
        category: ['Global'],
        defaultValue: ShowTimestampFormats[2].value,
        settings: {
          options: ShowTimestampFormats,
          allowCustomValue: true,
        },
        showIf: (c) => c.globalShowTimestampEnabled,
      })
      .addNumberInput({
        name: 'Font Size',
        path: 'globalShowTimestampFontSize',
        defaultValue: 12,
        settings: {
          min: 0,
        },
        category: ['Global'],
        description: 'Default font size to use when Global Auto Scale Fonts is disabled',
        showIf: (c) => !c.globalAutoScaleFonts,
      })
      .addSelect({
        name: 'Timestamp Position',
        path: 'globalShowTimestampPosition',
        description: 'Position of Timestamp',
        category: ['Global'],
        defaultValue: ShowTimestampPositions[1].value,
        settings: {
          options: ShowTimestampPositions,
          allowCustomValue: false,
        },
        showIf: (c) => c.globalShowTimestampEnabled,
      })
      .addNumberInput({
        name: 'Timestamp Y-Offset',
        path: 'globalShowTimestampYOffset',
        description: 'Adjust the displayed timestamp up or down the Y-Axis, use negative value to move up, positive for down',
        defaultValue: 0,
        settings: {
          integer: true,
        },
        category: ['Global'],
        showIf: (c) => c.globalShowTimestampEnabled,
      })

      // shape
      .addSelect({
        name: 'Shape',
        path: 'globalShape',
        description: 'Shape of polygon',
        category: ['Global'],
        defaultValue: PolygonNamedShapes[0].value,
        settings: {
          options: PolygonNamedShapes,
        },
      })

      // gradient colors enabled
      .addBooleanSwitch({
        name: 'Use Color Gradients',
        path: 'globalGradientsEnabled',
        defaultValue: true,
        category: ['Global'],
        description: 'Applies gradient color effect to all polygons',
      })
      .addColorPicker({
        name: 'Global Fill Color',
        path: 'globalFillColor',
        category: ['Global'],
        defaultValue: GLOBAL_FILL_COLOR_RGBA,
        description: 'Color to use when no overrides or thresholds apply to polygon',
      })

      // border color
      .addColorPicker({
        name: 'Global Border Color',
        path: 'globalPolygonBorderColor',
        category: ['Global'],
        defaultValue: GLOBAL_BORDER_COLOR_RGBA,
        description: 'Color of polygon border',
      })
      // unit
      .addUnitPicker({
        name: 'Unit',
        path: 'globalUnitFormat',
        defaultValue: 'short',
        category: ['Global'],
        description: 'Use this unit format when it is not specified in overrides or detected in data',
      })
      // stat (global operator)
      .addSelect({
        name: 'Stat',
        path: 'globalOperator',
        description: 'Statistic to display',
        category: ['Global'],
        defaultValue: OperatorOptions[0].value,
        settings: {
          options: OperatorOptions,
        },
      })
      // decimals
      .addNumberInput({
        name: 'Decimals',
        path: 'globalDecimals',
        description: 'Display specified number of decimals',
        defaultValue: 2,
        settings: {
          min: 0,
          integer: true,
        },
        category: ['Global'],
      })
      .addCustomEditor({
        name: 'Global Thresholds',
        id: 'globalThresholdsConfig',
        path: 'globalThresholdsConfig',
        description: 'Default thresholds to be applied to all metrics that do not have an override',
        editor: GlobalThresholdEditor,
        defaultValue: [] as PolystatThreshold[],
        category: ['Global'],
      })
      // default clickthrough
      .addTextInput({
        name: 'Default Clickthrough',
        path: 'globalClickthrough',
        description: 'URL to use when none are defined by overrides or composites',
        category: ['Global'],
        defaultValue: '',
      })
      // sanitize clickthrough
      .addBooleanSwitch({
        name: 'Sanitize URL',
        path: 'globalClickthroughSanitizedEnabled',
        defaultValue: true,
        category: ['Global'],
        description: 'Sanitizes clickthrough url',
      })
      // open in new tab
      .addBooleanSwitch({
        name: 'Open URL In New Tab',
        path: 'globalClickthroughNewTabEnabled',
        defaultValue: true,
        category: ['Global'],
        description: 'Opens clickthrough in a new tab',
      })
      .addBooleanSwitch({
        name: 'Enable Custom URL Target',
        path: 'globalClickthroughCustomTargetEnabled',
        defaultValue: false,
        category: ['Global'],
        description: 'Use custom target for global clickthrough (this overrides the new tab setting above). Typical values are: _blank|_self|_parent|_top|framename',
        showIf: (c) => !c.globalClickthroughNewTabEnabled,
      })
      .addTextInput({
        name: 'Custom URL Target',
        path: 'globalClickthroughCustomTarget',
        description:
          'Provide a different target to be set in the target attribute of the clickthrough. Typical values are: _blank|_self|_parent|_top|framename',
        category: ['Global'],
        defaultValue: '',
        showIf: (c) => c.globalClickthroughCustomTargetEnabled,
      })

      // aliasing
      .addTextInput({
        name: 'Global Regex',
        path: 'globalRegexPattern',
        description:
          'The values in the specified column are filtered and displayed according to this regular expression. Ex: String: Url|broadcom.com|mirror|location-1 regex: /Url&#92;|(.*?)&#92;|/ Output: broadcom.com',
        category: ['Global Aliasing'],
        defaultValue: '',
      })
      .addCustomEditor({
        name: 'Overrides',
        id: 'overrideConfig',
        path: 'overrideConfig',
        description: 'Overrides for multiple metrics',
        editor: OverrideEditor,
        defaultValue: {
          overrides: [] as OverrideItemType[],
        },
        category: ['Overrides'],
      })
      // allow enabling / disabling global aliasing for composite hexagon names
      .addBooleanSwitch({
        name: 'Composite Global Aliasing',
        path: 'compositeGlobalAliasingEnabled',
        defaultValue: false,
        description: 'Enable / Disable composite global aliasing',
        category: ['Composites'],
      })
      .addCustomEditor({
        name: 'Composites',
        id: 'compositeConfig',
        path: 'compositeConfig',
        description: 'Composites allow you to roll up multiple metrics into a single polygon',
        editor: CompositeEditor,
        defaultValue: {
          composites: [] as CompositeItemType[],
          enabled: true,
          animationSpeed: '1500',
        },
        category: ['Composites'],
      });
  })
  .setSuggestionsSupplier(new PolystatDataSuggestionsSupplier());
