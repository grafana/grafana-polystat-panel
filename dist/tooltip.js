System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, Tooltip;
    return {
        setters: [
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }
        ],
        execute: function () {
            Tooltip = (function () {
                function Tooltip() {
                }
                Tooltip.generate = function (scope, data, timestampEnabled) {
                    var items = [];
                    for (var index = 0; index < data.length; index++) {
                        var content = [];
                        var tooltipTimeFormat = "YYYY-MM-DD HH:mm:ss";
                        var time = scope.ctrl.dashboard.formatDate(data[index].timestamp, tooltipTimeFormat);
                        var timestampContent = "";
                        if (timestampEnabled) {
                            timestampContent =
                                "\n                     <tr>\n                       <td colspan=\"2\" style=\"text-align: center;\" class=\"graph-tooltip-time\">" + time + "</td>\n                     </tr>\n                    ";
                        }
                        content.push("\n                <table width=\"100%\" class=\"polystat-panel-tooltiptable\">\n                <thead>\n                  <tr>\n                    <th style=\"text-align: left;\">Name</th>\n                    <th style=\"text-align: right;\">Value</th>\n                  </tr>\n                </thead>\n                <tfoot>\n                  " + timestampContent + "\n                </tfoot>\n                <tbody>\n                ");
                        if (data[index].members.length > 0) {
                            var sortedMembers = lodash_1.default.orderBy(data[index].members, ["name"], ["asc"]);
                            for (var j = 0; j < sortedMembers.length; j++) {
                                var aMember = sortedMembers[j];
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