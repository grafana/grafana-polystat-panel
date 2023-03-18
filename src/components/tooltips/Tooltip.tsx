import React from 'react';
import { css } from '@emotion/css';
import { orderBy as lodashOrderBy } from 'lodash';
import { useStyles2 } from '@grafana/ui';
import { GrafanaTheme2, dateTimeFormatWithAbbrevation } from '@grafana/data';
import Tippy from '@tippyjs/react';
import { followCursor } from 'tippy.js';
import { PolystatModel, SortOptions } from '../types';

export interface TooltipProps {
  data: PolystatModel | undefined;
  valueEnabled: boolean;
  tooltipColumnHeadersEnabled: boolean;
  followMouse?: boolean;
  reference: any;
  visible: boolean;
  renderTime: Date;
  showTime: boolean;
  primarySortByField: string;
  primarySortDirection: number;
  secondarySortByField: string;
  secondarySortDirection: number;
  displayMode: string;
  tooltipDisplayTextTriggeredEmpty: string;
}

export const Tooltip = ({
  data,
  renderTime,
  showTime,
  valueEnabled,
  tooltipColumnHeadersEnabled,
  reference,
  visible,
  followMouse,
  primarySortByField,
  primarySortDirection,
  secondarySortByField,
  secondarySortDirection,
  displayMode,
  tooltipDisplayTextTriggeredEmpty,
}: TooltipProps) => {
  const styles = useStyles2(getTooltipStyles);

  /* the name of the composite is shown at the top */
  const getCompositeHeader = (data: PolystatModel | null) => {
    if (data && data.members && data.members.length === 0) {
      return '';
    }
    return (
      <tr>
        <th className={styles.tooltipCompositeHeading} colSpan={2}>
          {data!.displayName}
        </th>
      </tr>
    );
  };

  const multiSort = (
    data: PolystatModel,
    primarySortDirection: number,
    primarySortByField: string,
    secondarySortDirection: number,
    secondarySortByField: string
  ) => {
    let sortSettings = getSortDirection(SortOptions[primarySortDirection].value);
    const pUseLowercase = sortSettings.lowerCase;
    const pDirection = sortSettings.direction as any;
    sortSettings = getSortDirection(SortOptions[secondarySortDirection].value);
    const sDirection = sortSettings.direction as any;
    const sUseLowercase = sortSettings.lowerCase;

    let pSortFunction = primarySortByField as any;
    if (pUseLowercase) {
      pSortFunction = (item: any) => {
        let val = item[primarySortByField];
        if (typeof val !== 'number') {
          val = val.toLowerCase();
        }
        return val;
      };
    }
    let sSortFunction = secondarySortByField as any;
    if (sUseLowercase) {
      sSortFunction = (item: any) => {
        let val = item[secondarySortByField];
        if (typeof val !== 'number') {
          val = val.toLowerCase();
        }
        return val;
      };
    }
    const sortedMembers = lodashOrderBy(data.members, [pSortFunction, sSortFunction], [pDirection, sDirection]);
    return sortedMembers;
  };

  const getTriggeredCount = (data: PolystatModel) => {
    let triggered = 0;
    if (data.thresholdLevel !== 0) {
      triggered++;
    }
    for (let j = 0; j < data.members.length; j++) {
      if (data.members[j].thresholdLevel !== 0) {
        triggered++;
      }
    }
    return triggered;
  };
  const filterTriggered = (items: PolystatModel) => {
    const triggerCount = getTriggeredCount(items);
    if (triggerCount > 0) {
      for (let i = 0; i < items.members.length; i++) {
        if (items.members[i].thresholdLevel === 0) {
          items.members.splice(i, 1);
        }
      }
      return items;
    } else {
      return null;
    }
  };
  const getCompositeMetrics = (data: PolystatModel | null) => {
    let dataToSort = data;
    if (dataToSort && data && displayMode === 'triggered') {
      dataToSort = filterTriggered(data);
    }
    if (dataToSort === null) {
      return <>{tooltipDisplayTextTriggeredEmpty}</>;
    }
    const sortedMembers = multiSort(
      dataToSort,
      primarySortDirection,
      primarySortByField,
      secondarySortDirection,
      secondarySortByField
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
      <table className={styles.tooltipTable}>
        <thead>
          {data && data.isComposite && getCompositeHeader(data)}
          <tr>
            {tooltipColumnHeadersEnabled && <th className={styles.tooltipNameHeading}>Name</th>}
            {tooltipColumnHeadersEnabled && valueEnabled && <th className={styles.tooltipValueHeading}>Value</th>}
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
          {data && data.isComposite ? (
            getCompositeMetrics(data)
          ) : (
            <tr style={{ color: data!.color }}>
              <td className={styles.tooltipName}>{data!.displayName}</td>
              {valueEnabled && <td className={styles.tooltipValue}>{data!.valueFormatted}</td>}
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
      maxWidth={500}
    />
  );
};

const getTooltipStyles = (theme: GrafanaTheme2) => {
  return {
    root: css`
      border-radius: ${theme.shape.borderRadius(1)};
      background-color: ${theme.colors.background.primary};
      box-shadow: ${theme.shadows.z2};
      padding: ${theme.spacing(1)};
    `,
    tooltipTable: css`
      width: 100%;
      color: ${theme.colors.text.primary};
      height: auto;
      padding: 10px;
    `,
    tooltipTime: css`
      text-align: center;
      color: ${theme.colors.text.primary};
    `,
    tooltipNameHeading: css`
      text-align: left;
      color: ${theme.colors.text.primary};
    `,
    tooltipValueHeading: css`
      text-align: right;
      color: ${theme.colors.text.primary};
    `,
    tooltipCompositeHeading: css`
      text-align: center;
      color: ${theme.colors.text.primary};
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

const getSortDirection = (val: number) => {
  switch (val) {
    case 0:
      return { direction: null, lowerCase: false };
    case 1:
      return { direction: 'asc', lowerCase: false };
    case 2:
      return { direction: 'desc', lowerCase: false };
    case 3:
      return { direction: 'asc', lowerCase: false };
    case 4:
      return { direction: 'desc', lowerCase: false };
    case 5:
      return { direction: 'asc', lowerCase: true };
    case 6:
      return { direction: 'desc', lowerCase: true };
    default:
      return { direction: 'asc', lowerCase: false };
  }
};
