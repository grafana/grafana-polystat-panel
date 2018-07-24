System.register(["lodash"], function (exports_1, context_1) {
    "use strict";
    var lodash_1, Tooltip;
    var __moduleName = context_1 && context_1.id;
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
                Tooltip.generate = function (scope, data, polystat) {
                    var items = [];
                    for (var index = 0; index < data.length; index++) {
                        var tooltipTimeFormat = "YYYY-MM-DD HH:mm:ss";
                        var time = scope
                            .ctrl
                            .dashboard
                            .formatDate(data[index].timestamp, tooltipTimeFormat);
                        var timestampContent = "";
                        if (polystat.tooltipDisplayMode === "triggered") {
                            var triggeredCount = Tooltip.getTriggeredCount(data[index]);
                            if (triggeredCount === 0) {
                                if (polystat.tooltipTimestampEnabled) {
                                    timestampContent = "\n              <div class=\"polystat-panel-tooltip-time\">" + time + "</div>\n            ";
                                }
                                var content_1 = "\n          <div class=\"polystat-panel-tooltip-displaytext-empty\">" + polystat.tooltipDisplayTextTriggeredEmpty + "</div>\n          " + timestampContent + "\n          ";
                                items.push(content_1);
                                continue;
                            }
                        }
                        var content = [];
                        if (polystat.tooltipTimestampEnabled) {
                            timestampContent = "\n          <tr>\n            <td colspan=\"2\" style=\"text-align: center;\" class=\"graph-tooltip-time\">" + time + "</td>\n          </tr>\n        ";
                        }
                        content.push("\n        <table width=\"100%\" class=\"polystat-panel-tooltiptable\">\n        <thead>\n          <tr>\n            <th style=\"text-align: left;\">Name</th>\n            <th style=\"text-align: right;\">Value</th>\n          </tr>\n        </thead>\n        <tfoot>\n          " + timestampContent + "\n        </tfoot>\n        <tbody>\n      ");
                        if (data[index].members.length > 0) {
                            var sortedMembers = lodash_1.default.orderBy(data[index].members, [scope.ctrl.panel.polystat.tooltipPrimarySortField, scope.ctrl.panel.polystat.tooltipSecondarySortField], [scope.ctrl.panel.polystat.tooltipPrimarySortDirection, scope.ctrl.panel.polystat.tooltipSecondarySortDirection]);
                            for (var j = 0; j < sortedMembers.length; j++) {
                                var aMember = sortedMembers[j];
                                var aRow = "\n            <tr>\n              <td style=\"text-align: left; color: " + aMember.color + "\">" + aMember.name + "</td>\n              <td style=\"text-align: right; color: " + aMember.color + "\">" + aMember.valueFormatted + "</td>\n            </tr>\n          ";
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
                        }
                        else {
                            var aRow = "\n        <tr>\n          <td style=\"text-align: left; color: " + data[index].color + "\">" + data[index].name + "</td>\n          <td style=\"text-align: right; color: " + data[index].color + "\">" + data[index].valueFormatted + "</td>\n        </tr>\n        ";
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
                };
                Tooltip.getTriggeredCount = function (data) {
                    var triggered = 0;
                    if (data.thresholdLevel !== 0) {
                        triggered++;
                    }
                    for (var j = 0; j < data.members.length; j++) {
                        if (data.members[j].thresholdLevel !== 0) {
                            triggered++;
                        }
                    }
                    return triggered;
                };
                return Tooltip;
            }());
            exports_1("Tooltip", Tooltip);
        }
    };
});
//# sourceMappingURL=tooltip.js.map