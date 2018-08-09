/**
 * Tooltip generation
 */
import _ from "lodash";

export class Tooltip {
  static generate(scope, data, polystat) : string[] {
    let items = [];
    for (let index = 0; index < data.length; index++) {
      let tooltipTimeFormat = "YYYY-MM-DD HH:mm:ss";
      let time = scope
        .ctrl
        .dashboard
        .formatDate(data[index].timestamp, tooltipTimeFormat);
      let timestampContent = "";
      if (polystat.tooltipDisplayMode === "triggered") {
        let triggeredCount = Tooltip.getTriggeredCount(data[index]);
        if (triggeredCount === 0) {
          // use the displaytext instead
          if (polystat.tooltipTimestampEnabled) {
            timestampContent = `
              <div class="polystat-panel-tooltip-time">${time}</div>
            `;
          }
          let content = `
          <div class="polystat-panel-tooltip-displaytext-empty-compositename">${data[index].name}</div>
          <div class="polystat-panel-tooltip-displaytext-empty">${polystat.tooltipDisplayTextTriggeredEmpty}</div>
          ${timestampContent}
          `;
          items.push(content);
          continue;
        }
      }
      let content = [];
      if (polystat.tooltipTimestampEnabled) {
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

      /* Scenarios:
        tooltip set to trigggered
          data item has threshold > 0 and zero members, show data item
          data item members have threshold > 0, show members
        tooltip set to all
          data item displayed, or only members displayed
      */
      if (data[index].members.length > 0) {
        // sort members
        let sortedMembers = _.orderBy(
          data[index].members,
          [scope.ctrl.panel.polystat.tooltipPrimarySortField, scope.ctrl.panel.polystat.tooltipSecondarySortField],
          [scope.ctrl.panel.polystat.tooltipPrimarySortDirection, scope.ctrl.panel.polystat.tooltipSecondarySortDirection]
        );
        for (let j = 0; j < sortedMembers.length; j++) {
          let aMember = sortedMembers[j];
          let aRow = `
            <tr>
              <td style="text-align: left; color: ${aMember.color}">${aMember.name}</td>
              <td style="text-align: right; color: ${aMember.color}">${aMember.valueFormatted}</td>
            </tr>
          `;
          switch (polystat.tooltipDisplayMode) {
            case "triggered":
              if (aMember.thresholdLevel !== 0) {
                content.push(aRow);
              }
              break;
            default:
              content.push(aRow);
              break;
          }
        }
      } else {
        let aRow = `
        <tr>
          <td style="text-align: left; color: ${data[index].color}">${data[index].name}</td>
          <td style="text-align: right; color: ${data[index].color}">${data[index].valueFormatted}</td>
        </tr>
        `;
        switch (polystat.tooltipDisplayMode) {
          case "triggered":
            if (data[index].thresholdLevel !== 0) {
              content.push(aRow);
            }
            break;
          default:
            content.push(aRow);
            break;
        }
      }
      content.push("</tbody></table>");
      items.push(content.join("\n"));
    }
    return items;
  }
  // check all data and all composite members for state != 0
  static getTriggeredCount(data) {
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
  }
}
