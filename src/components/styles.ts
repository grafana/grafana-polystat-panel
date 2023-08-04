import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';

export const getErrorMessageStyles = (theme: GrafanaTheme2) => css`
  font-size: ${theme.typography.h1.fontSize};
  text-align: center;
  justify-content: center;
  color: ${theme.colors.error.shade};
`;

export const getNoTriggerTextStyles = (theme: GrafanaTheme2) => css`
  font-size: ${theme.typography.h1.fontSize};
  text-align: center;
  justify-content: center;
  color: ${theme.colors.success.shade};
`;

export const getWrapperStyles = (theme: GrafanaTheme2) => css`
  fill: transparent;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

export const getSVGStyles = (theme: GrafanaTheme2) => css`
  text-align: center;
  align-items: center;
  justify-content: center;
  fill: transparent;
`;

export const getSVGPathStyles = (theme: GrafanaTheme2) => css`
  outline: none !important;
`;
