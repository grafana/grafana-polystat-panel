System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Tooltip;
    return {
        setters: [],
        execute: function () {
            Tooltip = (function () {
                function Tooltip() {
                }
                Tooltip.generate = function (scope, data) {
                    var items = [];
                    for (var index = 0; index < data.length; index++) {
                        var content = [];
                        var tooltipTimeFormat = "YYYY-MM-DD HH:mm:ss";
                        var time = scope.ctrl.dashboard.formatDate(data[index].timestamp, tooltipTimeFormat);
                        content.push("\n                <table width=\"100%\" class=\"polystat-panel-tooltiptable\">\n                <thead>\n                  <tr>\n                    <th style=\"text-align: left;\">Name</th>\n                    <th style=\"text-align: right;\">Value</th>\n                  </tr>\n                </thead>\n                <tfoot>\n                  <tr>\n                    <td colspan=\"2\" style=\"text-align: center;\" class=\"graph-tooltip-time\">" + time + "</td>\n                  </tr>\n                </tfoot>\n                <tbody>\n                ");
                        if (data[index].members.length > 0) {
                            for (var j = 0; j < data[index].members.length; j++) {
                                var aMember = data[index].members[j];
                                content.push("\n                        <tr>\n                          <td style=\"text-align: left; color: " + aMember.color + "\">" + aMember.name + "</td>\n                          <td style=\"text-align: right; color: " + aMember.color + "\">" + aMember.valueFormatted + "</td>\n                        </tr>\n                      ");
                            }
                        }
                        else {
                            content.push("\n                    <tr>\n                      <td style=\"text-align: left; color: " + data[index].color + "\">" + data[index].name + "</td>\n                      <td style=\"text-align: right; color: " + data[index].color + "\">" + data[index].valueFormatted + "</td>\n                    </tr>\n                  ");
                        }
                        content.push("</tbody></table>");
                        items.push(content.join("\n"));
                    }
                    return items;
                };
                return Tooltip;
            }());
            exports_1("Tooltip", Tooltip);
        }
    };
});
//# sourceMappingURL=tooltip.js.map