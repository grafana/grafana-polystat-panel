import { useStyles } from '@grafana/ui';
import { GrafanaTheme, dateTimeFormatWithAbbrevation } from '@grafana/data';

import Tippy from '@tippyjs/react';
import { css } from 'emotion';
import { PolystatModel } from '../types';
import React from 'react';
import { followCursor } from 'tippy.js';
import { orderBy as lodashOrderBy } from 'lodash';

interface Props {
  data: PolystatModel;
  valueEnabled: boolean;
  followMouse?: boolean;
  reference: any;
  visible: boolean;
  renderTime: Date;
  showTime: boolean;
  primarySortByField: string;
  primarySortDirection: any; // easier..
  secondarySortByField: string;
  secondarySortDirection: any; // easier..
}

export const Tooltip = ({
  data,
  renderTime,
  showTime,
  valueEnabled,
  reference,
  visible,
  followMouse,
  primarySortByField,
  primarySortDirection,
  secondarySortByField,
  secondarySortDirection,
}: Props) => {
  const styles = useStyles(getTooltipStyles);

  /* the name of the composite is shown at the top */
  const getCompositeHeader = () => {
    if (data.members.length === 0) {
      return '';
    }
    return (
      <tr>
        <th className={styles.tooltipCompositeHeading} colSpan={2}>
          {data.displayName}
        </th>
      </tr>
    );
  };

  const getCompositeMetrics = () => {
    const sortedMembers = lodashOrderBy(
      data.members,
      [primarySortByField, secondarySortByField],
      [primarySortDirection, secondarySortDirection]
    );

    return sortedMembers.map((item: PolystatModel, index: number) => {
      return (
        <tr key={index} style={{ color: item.color }}>
          <td className={styles.tooltipName}>{item.displayName}</td>
          {valueEnabled && <td className={styles.tooltipValue}>{item.valueFormatted}</td>}
        </tr>
      );
    });
  };

  const generateContent = () => {
    return (
      <table className={styles.tooltip}>
        <thead>
          {getCompositeHeader()}
          <tr>
            <th className={styles.tooltipNameHeading}>Name</th>
            {valueEnabled && <th className={styles.tooltipValueHeading}>Value</th>}
          </tr>
        </thead>
        <tfoot>
          {showTime && (
            <tr>
              <td className={styles.tooltipTime} colSpan={2}>
                {dateTimeFormatWithAbbrevation(renderTime)}
              </td>
            </tr>
          )}
        </tfoot>
        <tbody>
          {data.isComposite ? (
            getCompositeMetrics()
          ) : (
            <tr style={{ color: data.color }}>
              <td className={styles.tooltipName}>{data.displayName}</td>
              {valueEnabled && <td className={styles.tooltipValue}>{data.valueFormatted}</td>}
            </tr>
          )}
        </tbody>
      </table>
    );
  };
  return (
    <Tippy
      ref={reference}
      visible={visible}
      content={generateContent()}
      followCursor={!!followMouse}
      plugins={[followCursor]}
      animation={false}
      className={styles.root}
      placement="auto"
    />
  );
};

const getTooltipStyles = (theme: GrafanaTheme) => {
  return {
    root: css`
      max-width: 500px;
      border-radius: ${theme.border.radius.sm};
      background-color: ${theme.colors.bg2};
      padding: ${theme.spacing.sm};
      box-shadow: 0px 0px 2px ${theme.colors.dropdownShadow};
    `,
    tooltip: css`
      width: 100%;
      color: ${theme.colors.textHeading};
      height: auto;
      padding: 10px;
    `,
    tooltipTime: css`
      text-align: center;
      color: ${theme.colors.textHeading};
    `,
    tooltipNameHeading: css`
      text-align: left;
      color: ${theme.colors.textHeading};
    `,
    tooltipValueHeading: css`
      text-align: right;
      color: ${theme.colors.textHeading};
    `,
    tooltipCompositeHeading: css`
      text-align: center;
      color: ${theme.colors.textHeading};
    `,
    tooltipName: css`
      text-align: left;
    `,
    tooltipValue: css`
      text-align: right;
      padding-left: 15px;
    `,
  };
};
