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
                        var time = scope
                            .ctrl
                            .dashboard
                            .formatDate(data[index].timestamp, tooltipTimeFormat);
                        var timestampContent = "";
                        if (timestampEnabled) {
                            timestampContent = "\n          <tr>\n            <td colspan=\"2\" style=\"text-align: center;\" class=\"graph-tooltip-time\">" + time + "</td>\n          </tr>\n        ";
                        }
                        content.push("\n        <table width=\"100%\" class=\"polystat-panel-tooltiptable\">\n        <thead>\n          <tr>\n            <th style=\"text-align: left;\">Name</th>\n            <th style=\"text-align: right;\">Value</th>\n          </tr>\n        </thead>\n        <tfoot>\n          " + timestampContent + "\n        </tfoot>\n        <tbody>\n      ");
                        if (data[index].members.length > 0) {
                            var primarySortField = scope.ctrl.panel.polystat.tooltipPrimarySortField;
                            var primarySortByField = "name";
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
                            var primarySortDirection = scope.ctrl.panel.polystat.tooltipPrimarySortDirection;
                            var primarySortByDirection = "asc";
                            switch (primarySortDirection) {
                                case "Ascending":
                                    primarySortByDirection = "asc";
                                    break;
                                case "Descending":
                                    primarySortByDirection = "desc";
                                    break;
                            }
                            var secondarySortField = scope.ctrl.panel.polystat.tooltipSecondarySortField;
                            var secondarySortByField = "value";
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
                            var secondarySortDirection = scope.ctrl.panel.polystat.tooltipSecondarySortDirection;
                            var secondarySortByDirection = "asc";
                            switch (secondarySortDirection) {
                                case "Ascending":
                                    secondarySortByDirection = "asc";
                                    break;
                                case "Descending":
                                    secondarySortByDirection = "desc";
                                    break;
                            }
                            var sortedMembers = lodash_1.default.orderBy(data[index].members, [primarySortByField, secondarySortByField], [primarySortByDirection, secondarySortByDirection]);
                            for (var j = 0; j < sortedMembers.length; j++) {
                                var aMember = sortedMembers[j];
                                content.push("\n            <tr>\n              <td style=\"text-align: left; color: " + aMember.color + "\">" + aMember.name + "</td>\n              <td style=\"text-align: right; color: " + aMember.color + "\">" + aMember.valueFormatted + "</td>\n            </tr>\n          ");
                            }
                        }
                        else {
                            content.push("\n          <tr>\n            <td style=\"text-align: left; color: " + data[index].color + "\">" + data[index].name + "</td>\n            <td style=\"text-align: right; color: " + data[index].color + "\">" + data[index].valueFormatted + "</td>\n          </tr>\n        ");
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