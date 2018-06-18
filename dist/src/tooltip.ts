/**
 * Tooltip generation
 */

export class Tooltip {
    static generate(scope, data) : string[] {
        let items = [];
        for (let index = 0; index < data.length; index++) {
            let content = [];
            let tooltipTimeFormat = "YYYY-MM-DD HH:mm:ss";
            let time = scope.ctrl.dashboard.formatDate(data[index].timestamp, tooltipTimeFormat);
            content.push(
                `
                <table width="100%" class="polystat-panel-tooltiptable">
                <thead>
                  <tr>
                    <th style="text-align: left;">Name</th>
                    <th style="text-align: right;">Value</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <td colspan="2" style="text-align: center;" class="graph-tooltip-time">${time}</td>
                  </tr>
                </tfoot>
                <tbody>
                `
            );
            if (data[index].members.length > 0) {
                for (let j = 0; j < data[index].members.length; j++) {
                    let aMember = data[index].members[j];
                    content.push(
                      `
                        <tr>
                          <td style="text-align: left; color: ${aMember.color}">${aMember.name}</td>
                          <td style="text-align: right; color: ${aMember.color}">${aMember.valueFormatted}</td>
                        </tr>
                      `
                    );
                }
            } else {
                content.push(
                  `
                    <tr>
                      <td style="text-align: left; color: ${data[index].color}">${data[index].name}</td>
                      <td style="text-align: right; color: ${data[index].color}">${data[index].valueFormatted}</td>
                    </tr>
                  `
                );
            }
            content.push("</tbody></table>");
            items.push(content.join("\n"));
        }
        return items;
    }
}
