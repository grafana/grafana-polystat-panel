import { Color } from './gradients/color';

/**
 * Color to use when rendering without any thresholds/overrides
 */
export const GLOBAL_FILL_COLOR_RGBA = 'rgba(10, 85, 161, 1)'; // "#0a55a1"
export const GLOBAL_BORDER_COLOR_RGBA = 'rgba(0, 0, 0, 0)'; // "#000000"
/**
 * Color for threshold OK state
 */
export const DEFAULT_OK_COLOR_RGBA = 'rgba(41, 156, 70, 1))'; // #299c46
export const DEFAULT_OK_COLOR = new Color(41, 156, 70);
/**
 * Color for threshold Warning state
 */
export const DEFAULT_WARNING_COLOR_RGBA = 'rgba(237, 129, 40, 1)'; // alternates // #FFC837 // '#e5ac0e'
export const DEFAULT_WARNING_COLOR = new Color(237, 129, 40);
/**
 * Color for threshold Critical state
 */
export const DEFAULT_CRITICAL_COLOR_RGBA = 'rgba(245, 54, 54, 1)';
export const DEFAULT_CRITICAL_COLOR = new Color(245, 54, 54);
/**
 * Unit to apply to all metrics without overrides
 */
export const GLOBAL_UNIT_FORMAT = 'short';
/**
 * Number of decimals to display in polygon
 */
export const GLOBAL_DISPLAY_DECIMALS = 2;
/**
 * Show all metrics
 */
export const GLOBAL_DISPLAY_MODE = 'all';
/**
 * Display OK when global mode is set to triggered and there are no triggers
 */
export const GLOBAL_DISPLAY_TEXT_TRIGGERED_EMPTY = 'OK';
/**
 * Display average (mean) stat for metric
 */
export const GLOBAL_OPERATOR_NAME = 'avg'; // mean

export const GLOBAL_OVERRIDE_COLORS = [
  '#299c46', // "rgba(41, 156, 70, 1)", // green
  '#ed8128', // "rgba(237, 129, 40, 1)", // yellow
  '#f53636', // "rgba(245, 54, 54, 1)", // red
  '#0a55a1', // 'rgba(10, 85, 161, 1)' // blue
];