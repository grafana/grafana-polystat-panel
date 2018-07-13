/**
 * Tooltip generation
 */
import _ from "lodash";

export class Tooltip {
  static generate(scope, data, timestampEnabled) : string[] {
    let items = [];
    for (let index = 0; index < data.length; index++) {
      let content = [];
      let tooltipTimeFormat = "YYYY-MM-DD HH:mm:ss";
      let time = scope
        .ctrl
        .dashboard
        .formatDate(data[index].timestamp, tooltipTimeFormat);
      let timestampContent = "";
      if (timestampEnabled) {
        timestampContent = `
          <tr>
            <td colspan="2" style="text-align: center;" class="graph-tooltip-time">${time}</td>
          </tr>
        `;
      }
      content.push(`
        <table width="100%" class="polystat-panel-tooltiptable">
        <thead>
          <tr>
            <th style="text-align: left;">Name</th>
            <th style="text-align: right;">Value</th>
          </tr>
        </thead>
        <tfoot>
          ${timestampContent}
        </tfoot>
        <tbody>
      `);
      if (data[index].members.length > 0) {
        // sort members
        let primarySortField = scope.ctrl.panel.polystat.tooltipPrimarySortField;
        let primarySortByField = "name";
        switch (primarySortField) {
          case "Name":
            primarySortByField = "name";
            break;
          case "Threshold Level":
            primarySortByField = "thresholdLevel";
            break;
          case "Value":
            primarySortByField = "value";
            break;
        }
        let primarySortDirection = scope.ctrl.panel.polystat.tooltipPrimarySortDirection;
        let primarySortByDirection = "asc";
        switch (primarySortDirection) {
          case "Ascending":
            primarySortByDirection = "asc";
            break;
          case "Descending":
            primarySortByDirection = "desc";
            break;
        }

        let secondarySortField = scope.ctrl.panel.polystat.tooltipSecondarySortField;
        let secondarySortByField = "value";
        switch (secondarySortField) {
          case "Name":
            secondarySortByField = "name";
            break;
          case "Threshold Level":
            secondarySortByField = "thresholdLevel";
            break;
          case "Value":
            secondarySortByField = "value";
            break;
        }
        let secondarySortDirection = scope.ctrl.panel.polystat.tooltipSecondarySortDirection;
        let secondarySortByDirection = "asc";
        switch (secondarySortDirection) {
          case "Ascending":
            secondarySortByDirection = "asc";
            break;
          case "Descending":
            secondarySortByDirection = "desc";
            break;
        }
        let sortedMembers = _.orderBy(data[index].members,
          [primarySortByField, secondarySortByField],
          [primarySortByDirection, secondarySortByDirection]
        );
        for (let j = 0; j < sortedMembers.length; j++) {
          let aMember = sortedMembers[j];
          content.push(`
            <tr>
              <td style="text-align: left; color: ${aMember.color}">${aMember.name}</td>
              <td style="text-align: right; color: ${aMember.color}">${aMember.valueFormatted}</td>
            </tr>
          `);
        }
      } else {
        content.push(`
          <tr>
            <td style="text-align: left; color: ${data[index].color}">${data[index].name}</td>
            <td style="text-align: right; color: ${data[index].color}">${data[index].valueFormatted}</td>
          </tr>
        `);
      }
      content.push("</tbody></table>");
      items.push(content.join("\n"));
    }
    return items;
  }
}
