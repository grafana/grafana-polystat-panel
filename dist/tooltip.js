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
                                var content_1 = "\n          <div class=\"polystat-panel-tooltip-displaytext-empty-compositename\">" + data[index].name + "</div>\n          <div class=\"polystat-panel-tooltip-displaytext-empty\">" + polystat.tooltipDisplayTextTriggeredEmpty + "</div>\n          " + timestampContent + "\n          ";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90b29sdGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O1lBS0E7Z0JBQUE7Z0JBdUhBLENBQUM7Z0JBdEhRLGdCQUFRLEdBQWYsVUFBZ0IsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRO29CQUNuQyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7b0JBQ2YsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7d0JBQ2hELElBQUksaUJBQWlCLEdBQUcscUJBQXFCLENBQUM7d0JBQzlDLElBQUksSUFBSSxHQUFHLEtBQUs7NkJBQ2IsSUFBSTs2QkFDSixTQUFTOzZCQUNULFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUFDLENBQUM7d0JBQ3hELElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO3dCQUMxQixJQUFJLFFBQVEsQ0FBQyxrQkFBa0IsS0FBSyxXQUFXLEVBQUU7NEJBQy9DLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs0QkFDNUQsSUFBSSxjQUFjLEtBQUssQ0FBQyxFQUFFO2dDQUV4QixJQUFJLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtvQ0FDcEMsZ0JBQWdCLEdBQUcsZ0VBQzBCLElBQUkseUJBQ2hELENBQUM7aUNBQ0g7Z0NBQ0QsSUFBSSxTQUFPLEdBQUcsdUZBQ3dELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLGtGQUM5QixRQUFRLENBQUMsZ0NBQWdDLDBCQUMvRixnQkFBZ0IsaUJBQ2pCLENBQUM7Z0NBQ0YsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFPLENBQUMsQ0FBQztnQ0FDcEIsU0FBUzs2QkFDVjt5QkFDRjt3QkFDRCxJ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RUFBRSxFQUFFO3dCQUM1QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxLQUFLLENBQUMsRUFBRTs0QkFDeEMsU0FBUyxFQUFFLENBQUM7eUJBQ2I7cUJBQ0Y7b0JBQ0QsT0FBTyxTQUFTLENBQUM7Z0JBQ25CLENBQUM7Z0JBQ0gsY0FBQztZQUFELENBQUMsQUF2SEQsSUF1SEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRvb2x0aXAgZ2VuZXJhdGlvblxuICovXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5cbmV4cG9ydCBjbGFzcyBUb29sdGlwIHtcbiAgc3RhdGljIGdlbmVyYXRlKHNjb3BlLCBkYXRhLCBwb2x5c3RhdCkgOiBzdHJpbmdbXSB7XG4gICAgbGV0IGl0ZW1zID0gW107XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBsZXQgdG9vbHRpcFRpbWVGb3JtYXQgPSBcIllZWVktTU0tREQgSEg6bW06c3NcIjtcbiAgICAgIGxldCB0aW1lID0gc2NvcGVcbiAgICAgICAgLmN0cmxcbiAgICAgICAgLmRhc2hib2FyZFxuICAgICAgICAuZm9ybWF0RGF0ZShkYXRhW2luZGV4XS50aW1lc3RhbXAsIHRvb2x0aXBUaW1lRm9ybWF0KTtcbiAgICAgIGxldCB0aW1lc3RhbXBDb250ZW50ID0gXCJcIjtcbiAgICAgIGlmIChwb2x5c3RhdC50b29sdGlwRGlzcGxheU1vZGUgPT09IFwidHJpZ2dlcmVkXCIpIHtcbiAgICAgICAgbGV0IHRyaWdnZXJlZENvdW50ID0gVG9vbHRpcC5nZXRUcmlnZ2VyZWRDb3VudChkYXRhW2luZGV4XSk7XG4gICAgICAgIGlmICh0cmlnZ2VyZWRDb3VudCA9PT0gMCkge1xuICAgICAgICAgIC8vIHVzZSB0aGUgZGlzcGxheXRleHQgaW5zdGVhZFxuICAgICAgICAgIGlmIChwb2x5c3RhdC50b29sdGlwVGltZXN0YW1wRW5hYmxlZCkge1xuICAgICAgICAgICAgdGltZXN0YW1wQ29udGVudCA9IGBcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBvbHlzdGF0LXBhbmVsLXRvb2x0aXAtdGltZVwiPiR7dGltZX08L2Rpdj5cbiAgICAgICAgICAgIGA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBjb250ZW50ID0gYFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb2x5c3RhdC1wYW5lbC10b29sdGlwLWRpc3BsYXl0ZXh0LWVtcHR5LWNvbXBvc2l0ZW5hbWVcIj4ke2RhdGFbaW5kZXhdLm5hbWV9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInBvbHlzdGF0LXBhbmVsLXRvb2x0aXAtZGlzcGxheXRleHQtZW1wdHlcIj4ke3BvbHlzdGF0LnRvb2x0aXBEaXNwbGF5VGV4dFRyaWdnZXJlZEVtcHR5fTwvZGl2PlxuICAgICAgICAgICR7dGltZXN0YW1wQ29udGVudH1cbiAgICAgICAgICBgO1xuICAgICAgICAgIGl0ZW1zLnB1c2goY29udGVudCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBjb250ZW50ID0gW107XG4gICAgICBpZiAocG9seXN0YXQudG9vbHRpcFRpbWVzdGFtcEVuYWJsZWQpIHtcbiAgICAgICAgdGltZXN0YW1wQ29udGVudCA9IGBcbiAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjJcIiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjtcIiBjbGFzcz1cImdyYXBoLXRvb2x0aXAtdGltZVwiPiR7dGltZX08L3RkPlxuICAgICAgICAgIDwvdHI+XG4gICAgICAgIGA7XG4gICAgICB9XG4gICAgICBjb250ZW50LnB1c2goYFxuICAgICAgICA8dGFibGUgd2lkdGg9XCIxMDAlXCIgY2xhc3M9XCJwb2x5c3RhdC1wYW5lbC10b29sdGlwdGFibGVcIj5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0aCBzdHlsZT1cInRleHQtYWxpZ246IGxlZnQ7XCI+TmFtZTwvdGg+XG4gICAgICAgICAgICA8dGggc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodDtcIj5WYWx1ZTwvdGg+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRmb290PlxuICAgICAgICAgICR7dGltZXN0YW1wQ29udGVudH1cbiAgICAgICAgPC90Zm9vdD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgYCk7XG5cbiAgICAgIC8qIFNjZW5hcmlvczpcbiAgICAgICAgdG9vbHRpcCBzZXQgdG8gdHJpZ2dnZXJlZFxuICAgICAgICAgIGRhdGEgaXRlbSBoYXMgdGhyZXNob2xkID4gMCBhbmQgemVybyBtZW1iZXJzLCBzaG93IGRhdGEgaXRlbVxuICAgICAgICAgIGRhdGEgaXRlbSBtZW1iZXJzIGhhdmUgdGhyZXNob2xkID4gMCwgc2hvdyBtZW1iZXJzXG4gICAgICAgIHRvb2x0aXAgc2V0IHRvIGFsbFxuICAgICAgICAgIGRhdGEgaXRlbSBkaXNwbGF5ZWQsIG9yIG9ubHkgbWVtYmVycyBkaXNwbGF5ZWRcbiAgICAgICovXG4gICAgICBpZiAoZGF0YVtpbmRleF0ubWVtYmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIHNvcnQgbWVtYmVyc1xuICAgICAgICBsZXQgc29ydGVkTWVtYmVycyA9IF8ub3JkZXJCeShcbiAgICAgICAgICBkYXRhW2luZGV4XS5tZW1iZXJzLFxuICAgICAgICAgIFtzY29wZS5jdHJsLnBhbmVsLnBvbHlzdGF0LnRvb2x0aXBQcmltYXJ5U29ydEZpZWxkLCBzY29wZS5jdHJsLnBhbmVsLnBvbHlzdGF0LnRvb2x0aXBTZWNvbmRhcnlTb3J0RmllbGRdLFxuICAgICAgICAgIFtzY29wZS5jdHJsLnBhbmVsLnBvbHlzdGF0LnRvb2x0aXBQcmltYXJ5U29ydERpcmVjdGlvbiwgc2NvcGUuY3RybC5wYW5lbC5wb2x5c3RhdC50b29sdGlwU2Vjb25kYXJ5U29ydERpcmVjdGlvbl1cbiAgICAgICAgKTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzb3J0ZWRNZW1iZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbGV0IGFNZW1iZXIgPSBzb3J0ZWRNZW1iZXJzW2pdO1xuICAgICAgICAgIGxldCBhUm93ID0gYFxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiBsZWZ0OyBjb2xvcjogJHthTWVtYmVyLmNvbG9yfVwiPiR7YU1lbWJlci5uYW1lfTwvdGQ+XG4gICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0OyBjb2xvcjogJHthTWVtYmVyLmNvbG9yfVwiPiR7YU1lbWJlci52YWx1ZUZvcm1hdHRlZH08L3RkPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICBgO1xuICAgICAgICAgIHN3aXRjaCAocG9seXN0YXQudG9vbHRpcERpc3BsYXlNb2RlKSB7XG4gICAgICAgICAgICBjYXNlIFwidHJpZ2dlcmVkXCI6XG4gICAgICAgICAgICAgIGlmIChhTWVtYmVyLnRocmVzaG9sZExldmVsICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29udGVudC5wdXNoKGFSb3cpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgY29udGVudC5wdXNoKGFSb3cpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBhUm93ID0gYFxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogbGVmdDsgY29sb3I6ICR7ZGF0YVtpbmRleF0uY29sb3J9XCI+JHtkYXRhW2luZGV4XS5uYW1lfTwvdGQ+XG4gICAgICAgICAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHQ7IGNvbG9yOiAke2RhdGFbaW5kZXhdLmNvbG9yfVwiPiR7ZGF0YVtpbmRleF0udmFsdWVGb3JtYXR0ZWR9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgYDtcbiAgICAgICAgc3dpdGNoIChwb2x5c3RhdC50b29sdGlwRGlzcGxheU1vZGUpIHtcbiAgICAgICAgICBjYXNlIFwidHJpZ2dlcmVkXCI6XG4gICAgICAgICAgICBpZiAoZGF0YVtpbmRleF0udGhyZXNob2xkTGV2ZWwgIT09IDApIHtcbiAgICAgICAgICAgICAgY29udGVudC5wdXNoKGFSb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnRlbnQucHVzaChhUm93KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb250ZW50LnB1c2goXCI8L3Rib2R5PjwvdGFibGU+XCIpO1xuICAgICAgaXRlbXMucHVzaChjb250ZW50LmpvaW4oXCJcXG5cIikpO1xuICAgIH1cbiAgICByZXR1cm4gaXRlbXM7XG4gIH1cbiAgLy8gY2hlY2sgYWxsIGRhdGEgYW5kIGFsbCBjb21wb3NpdGUgbWVtYmVycyBmb3Igc3RhdGUgIT0gMFxuICBzdGF0aWMgZ2V0VHJpZ2dlcmVkQ291bnQoZGF0YSkge1xuICAgIGxldCB0cmlnZ2VyZWQgPSAwO1xuICAgIGlmIChkYXRhLnRocmVzaG9sZExldmVsICE9PSAwKSB7XG4gICAgICB0cmlnZ2VyZWQrKztcbiAgICB9XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBkYXRhLm1lbWJlcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChkYXRhLm1lbWJlcnNbal0udGhyZXNob2xkTGV2ZWwgIT09IDApIHtcbiAgICAgICAgdHJpZ2dlcmVkKys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cmlnZ2VyZWQ7XG4gIH1cbn1cbiJdfQ==