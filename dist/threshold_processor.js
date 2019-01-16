System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function getWorstSeries(series1, series2, defaultColor) {
        var worstSeries = series1;
        var series1Value = getValueByStatName(series1.operatorName, series1);
        var series2Value = getValueByStatName(series2.operatorName, series2);
        var series1result = getThresholdLevelForValue(series1.thresholds, series1Value, defaultColor);
        var series2result = getThresholdLevelForValue(series2.thresholds, series2Value, defaultColor);
        if (series2result.thresholdLevel > series1result.thresholdLevel) {
            worstSeries = series2;
        }
        if (series1result.thresholdLevel === 3) {
            switch (series2result.thresholdLevel) {
                case 1:
                    worstSeries = series2;
                    break;
                case 2:
                    worstSeries = series2;
                    break;
            }
        }
        return worstSeries;
    }
    exports_1("getWorstSeries", getWorstSeries);
    function getThresholdLevelForValue(thresholds, value, defaultColor) {
        var colorGrey = "#808080";
        var currentColor = defaultColor;
        if (value === null) {
            return { thresholdLevel: 3, color: colorGrey };
        }
        var currentState = -1;
        if (typeof thresholds === "undefined") {
            return { thresholdLevel: currentState, color: defaultColor };
        }
        var thresholdCount = thresholds.length;
        if (thresholdCount === 0) {
            return { thresholdLevel: currentState, color: defaultColor };
        }
        var aThreshold = thresholds[thresholdCount - 1];
        if (value >= aThreshold.value) {
            currentState = aThreshold.state;
            currentColor = aThreshold.color;
        }
        if (thresholds.length === 1) {
            return { thresholdLevel: currentState, color: currentColor };
        }
        for (var i = thresholdCount - 1; i > 0; i--) {
            var upperThreshold = thresholds[i];
            var lowerThreshold = thresholds[i - 1];
            if ((lowerThreshold.value <= value) && (value < upperThreshold.value)) {
                if (currentState < lowerThreshold.state) {
                    currentState = lowerThreshold.state;
                    currentColor = lowerThreshold.color;
                }
            }
        }
        if (currentState === -1) {
            currentState = thresholds[0].state;
            currentColor = thresholds[0].color;
        }
        console.log("Returning threshold level: " + currentState + " color: " + currentColor);
        return { thresholdLevel: currentState, color: currentColor };
    }
    exports_1("getThresholdLevelForValue", getThresholdLevelForValue);
    function getValueByStatName(operatorName, data) {
        var value = data.stats.avg;
        switch (operatorName) {
            case "avg":
                value = data.stats.avg;
                break;
            case "count":
                value = data.stats.count;
                break;
            case "current":
                value = data.stats.current;
                break;
            case "delta":
                value = data.stats.delta;
                break;
            case "diff":
                value = data.stats.diff;
                break;
            case "first":
                value = data.stats.first;
                break;
            case "logmin":
                value = data.stats.logmin;
                break;
            case "max":
                value = data.stats.max;
                break;
            case "min":
                value = data.stats.min;
                break;
            case "name":
                value = data.metricName;
                break;
            case "time_step":
                value = data.stats.timeStep;
                break;
            case "last_time":
                value = data.timestamp;
                break;
            case "total":
                value = data.stats.total;
                break;
            default:
                value = data.stats.avg;
                break;
        }
        return value;
    }
    exports_1("getValueByStatName", getValueByStatName);
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyZXNob2xkX3Byb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90aHJlc2hvbGRfcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQXFEQSxTQUFTLGNBQWMsQ0FBQyxPQUFZLEVBQUUsT0FBWSxFQUFFLFlBQW9CO1FBQ3RFLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUMxQixJQUFJLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3JFLElBQUksWUFBWSxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckUsSUFBSSxhQUFhLEdBQUcseUJBQXlCLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDOUYsSUFBSSxhQUFhLEdBQUcseUJBQXlCLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFHOUYsSUFBSSxhQUFhLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQyxjQUFjLEVBQUU7WUFFL0QsV0FBVyxHQUFHLE9BQU8sQ0FBQztTQUN2QjtRQUNELElBQUksYUFBYSxDQUFDLGNBQWMsS0FBSyxDQUFDLEVBQUU7WUFFdEMsUUFBUSxhQUFhLENBQUMsY0FBYyxFQUFFO2dCQUNwQyxLQUFLLENBQUM7b0JBQ0osV0FBVyxHQUFHLE9BQU8sQ0FBQztvQkFDdEIsTUFBTTtnQkFDUixLQUFLLENBQUM7b0JBQ0osV0FBVyxHQUFHLE9BQU8sQ0FBQztvQkFDeEIsTUFBTTthQUNQO1NBQ0Y7UUFDRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOztJQUVELFNBQVMseUJBQXlCLENBQUMsVUFBZSxFQUFFLEtBQWEsRUFBRSxZQUFvQjtRQUNyRixJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDMUIsSUFBSSxZQUFZ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QUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDeEIsTUFBTTtZQUNSLEtBQUssT0FBTztnQkFDVixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ3pCLE1BQU07WUFDUixLQUFLLFFBQVE7Z0JBQ1gsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO2dCQUMxQixNQUFNO1lBQ1IsS0FBSyxLQUFLO2dCQUNSLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDdkIsTUFBTTtZQUNSLEtBQUssS0FBSztnQkFDUixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ3ZCLE1BQU07WUFDUixLQUFLLE1BQU07Z0JBQ1QsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ3hCLE1BQU07WUFDUixLQUFLLFdBQVc7Z0JBQ2QsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2dCQUM1QixNQUFNO1lBQ1IsS0FBSyxXQUFXO2dCQUNkLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUN2QixNQUFNO1lBQ1IsS0FBSyxPQUFPO2dCQUNWLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDekIsTUFBTTtZQUNSO2dCQUNFLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDdkIsTUFBTTtTQUNSO1FBQ0YsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuVGhpcyBzdXBwb3J0cyByYW5nZWQgc3RhdGVzXG5cblRocmVzaG9sZHMgYXJlIGV4cGVjdGVkIHRvIGJlIHNvcnRlZCBieSBhc2NlbmRpbmcgdmFsdWUsIHdoZXJlXG4gIFQwID0gbG93ZXN0IGRlY2ltYWwgdmFsdWUsIGFueSBzdGF0ZVxuICBUTiA9IGhpZ2hlc3QgZGVjaW1hbCB2YWx1ZSwgYW55IHN0YXRlXG5cbkluaXRpYWwgc3RhdGUgaXMgc2V0IHRvIFwib2tcIlxuXG5BIGNvbXBhcmlzb24gaXMgbWFkZSB1c2luZyBcImdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0b1wiIGFnYWluc3QgdGhlIHZhbHVlXG4gIElmIHZhbHVlID49IHRocmVzaG9sZFZhbHVlIHN0YXRlID0gWFxuXG5Db21wYXJpc29ucyBhcmUgbWFkZSBpbiByZXZlcnNlIG9yZGVyLCB1c2luZyB0aGUgcmFuZ2UgYmV0d2VlbiB0aGUgTnRoIChpbmNsdXNpdmUpIHRocmVzaG9sZCBhbmQgTisxIChleGNsdXNpdmUpXG4gIEluY2x1c2l2ZVZhbHVlID0gVChuKS52YWx1ZVxuICBFeGNsdXNpdmVWYWx1ZSA9IFQobisxKS52YWx1ZVxuXG5XaGVuIHRoZXJlIGlzIG5vIG4rMSB0aHJlc2hvbGQsIHRoZSBoaWdoZXN0IHZhbHVlIHRocmVzaG9sZCBUKG4pLCBhIHNpbXBsZSBpbmNsdXNpdmUgPj0gY29tcGFyaXNvbiBpcyBtYWRlXG5cbiAgRXhhbXBsZSAxOiAodHlwaWNhbCBsaW5lYXIpXG4gICAgVDAgLSA1LCBva1xuICAgIFQxIC0gMTAsIHdhcm5pbmdcbiAgICBUMiAtIDIwLCBjcml0aWNhbFxuXG4gIFZhbHVlID49IDIwIChWYWx1ZSA+PSBUMilcbiAgMTAgPD0gVmFsdWUgPCAyMCAgKFQxIDw9IFZhbHVlIDwgVDIpXG4gIDUgPD0gVmFsdWUgPCAxMCAgIChUMCA8PSBWYWx1ZSA8IFQxKVxuXG4gIEV4YW1wbGUgMjogKHJldmVyc2UgbGluZWFyKVxuICAgIFQwIC0gNTAsIGNyaXRpY2FsXG4gICAgVDEgLSA5MCwgd2FybmluZ1xuICAgIFQyIC0gMTAwLCBva1xuXG4gIFZhbHVlID49IDEwMFxuICA5MCA8PSB2YWx1ZSA8IDEwMFxuICA1MCA8PSB2YWx1ZSA8IDkwXG5cbiAgRXhhbXBsZSAzOiAoYm91bmRlZClcbiAgICBUMCAtIDUwLCBjcml0aWNhbFxuICAgIFQxIC0gNjAsIHdhcm5pbmdcbiAgICBUMiAtIDcwLCBva1xuICAgIFQzIC0gODAsIHdhcm5pbmdcbiAgICBUNCAtIDkwLCBjcml0aWNhbFxuXG4gICAgVmFsdWUgPj0gOTBcbiAgICA4MCA8PSBWYWx1ZSA8IDkwXG4gICAgNzAgPD0gVmFsdWUgPCA4MFxuICAgIDYwIDw9IFZhbHVlIDwgNzBcbiAgICA1MCA8PSBWYWx1ZSA8IDYwXG5cblRoZSBcIndvcnN0XCIgc3RhdGUgaXMgcmV0dXJuZWQgYWZ0ZXIgY2hlY2tpbmcgZXZlcnkgdGhyZXNob2xkIHJhbmdlXG5cbiovXG5mdW5jdGlvbiBnZXRXb3JzdFNlcmllcyhzZXJpZXMxOiBhbnksIHNlcmllczI6IGFueSwgZGVmYXVsdENvbG9yOiBzdHJpbmcpOiBhbnkge1xuICB2YXIgd29yc3RTZXJpZXMgPSBzZXJpZXMxO1xuICB2YXIgc2VyaWVzMVZhbHVlID0gZ2V0VmFsdWVCeVN0YXROYW1lKHNlcmllczEub3BlcmF0b3JOYW1lLCBzZXJpZXMxKTtcbiAgdmFyIHNlcmllczJWYWx1ZSA9IGdldFZhbHVlQnlTdGF0TmFtZShzZXJpZXMyLm9wZXJhdG9yTmFtZSwgc2VyaWVzMik7XG4gIHZhciBzZXJpZXMxcmVzdWx0ID0gZ2V0VGhyZXNob2xkTGV2ZWxGb3JWYWx1ZShzZXJpZXMxLnRocmVzaG9sZHMsIHNlcmllczFWYWx1ZSwgZGVmYXVsdENvbG9yKTtcbiAgdmFyIHNlcmllczJyZXN1bHQgPSBnZXRUaHJlc2hvbGRMZXZlbEZvclZhbHVlKHNlcmllczIudGhyZXNob2xkcywgc2VyaWVzMlZhbHVlLCBkZWZhdWx0Q29sb3IpO1xuXG4gIC8vIFN0YXRlIDMgaXMgVW5rbm93biBhbmQgaXMgbm90IGJlIHdvcnNlIHRoYW4gQ1JJVElDQUwgKHN0YXRlIDIpXG4gIGlmIChzZXJpZXMycmVzdWx0LnRocmVzaG9sZExldmVsID4gc2VyaWVzMXJlc3VsdC50aHJlc2hvbGRMZXZlbCkge1xuICAgIC8vIHNlcmllczIgaGFzIGhpZ2hlciB0aHJlc2hvbGQgdmlvbGF0aW9uXG4gICAgd29yc3RTZXJpZXMgPSBzZXJpZXMyO1xuICB9XG4gIGlmIChzZXJpZXMxcmVzdWx0LnRocmVzaG9sZExldmVsID09PSAzKSB7XG4gICAgLy8gc2VyaWVzMSBpcyBpbiBzdGF0ZSB1bmtub3duLCBjaGVjayBpZiBzZXJpZXMyIGlzIGluIHN0YXRlIDEgb3IgMlxuICAgIHN3aXRjaCAoc2VyaWVzMnJlc3VsdC50aHJlc2hvbGRMZXZlbCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB3b3JzdFNlcmllcyA9IHNlcmllczI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICB3b3JzdFNlcmllcyA9IHNlcmllczI7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHdvcnN0U2VyaWVzO1xufVxuXG5mdW5jdGlvbiBnZXRUaHJlc2hvbGRMZXZlbEZvclZhbHVlKHRocmVzaG9sZHM6IGFueSwgdmFsdWU6IG51bWJlciwgZGVmYXVsdENvbG9yOiBzdHJpbmcpOiB7dGhyZXNob2xkTGV2ZWw6IG51bWJlciwgY29sb3I6IHN0cmluZ30ge1xuICBsZXQgY29sb3JHcmV5ID0gXCIjODA4MDgwXCI7IC8vIFwiZ3JleVwiXG4gIGxldCBjdXJyZW50Q29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiB7IHRocmVzaG9sZExldmVsOiAzLCBjb2xvcjogY29sb3JHcmV5fTsgLy8gTm8gRGF0YVxuICB9XG4gIC8vIGFzc3VtZSBVTktOT1dOIHN0YXRlXG4gIGxldCBjdXJyZW50U3RhdGUgPSAtMTtcbiAgLy8gc2tpcCBldmFsdWF0aW9uIHdoZW4gdGhlcmUgYXJlIG5vIHRocmVzaG9sZHNcbiAgaWYgKHR5cGVvZiB0aHJlc2hvbGRzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHsgdGhyZXNob2xkTGV2ZWw6IGN1cnJlbnRTdGF0ZSwgY29sb3I6IGRlZmF1bHRDb2xvcn07XG4gIH1cbiAgLy8gdGVzdCBcIk50aFwiIHRocmVzaG9sZFxuICBsZXQgdGhyZXNob2xkQ291bnQgPSB0aHJlc2hvbGRzLmxlbmd0aDtcbiAgaWYgKHRocmVzaG9sZENvdW50ID09PSAwKSB7XG4gICAgcmV0dXJuIHsgdGhyZXNob2xkTGV2ZWw6IGN1cnJlbnRTdGF0ZSwgY29sb3I6IGRlZmF1bHRDb2xvcn07XG4gIH1cbiAgbGV0IGFUaHJlc2hvbGQgPSB0aHJlc2hvbGRzW3RocmVzaG9sZENvdW50IC0gMV07XG4gIGlmICh2YWx1ZSA+PSBhVGhyZXNob2xkLnZhbHVlKSB7XG4gICAgY3VycmVudFN0YXRlID0gYVRocmVzaG9sZC5zdGF0ZTtcbiAgICBjdXJyZW50Q29sb3IgPSBhVGhyZXNob2xkLmNvbG9yO1xuICB9XG4gIC8vIGlmIHRoZXJlJ3Mgb25lIHRocmVzaG9sZCwganVzdCByZXR1cm4gdGhlIHJlc3VsdFxuICBpZiAodGhyZXNob2xkcy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4geyB0aHJlc2hvbGRMZXZlbDogY3VycmVudFN0YXRlLCBjb2xvcjogY3VycmVudENvbG9yfTtcbiAgfVxuICAvLyBub3cgdGVzdCBpbiByZXZlcnNlXG4gIGZvciAobGV0IGkgPSB0aHJlc2hvbGRDb3VudCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICBsZXQgdXBwZXJUaHJlc2hvbGQgPSB0aHJlc2hvbGRzW2ldO1xuICAgIGxldCBsb3dlclRocmVzaG9sZCA9IHRocmVzaG9sZHNbaSAtIDFdO1xuICAgIGlmICgobG93ZXJUaHJlc2hvbGQudmFsdWUgPD0gdmFsdWUpICYmICh2YWx1ZSA8IHVwcGVyVGhyZXNob2xkLnZhbHVlKSkge1xuICAgICAgaWYgKGN1cnJlbnRTdGF0ZSA8IGxvd2VyVGhyZXNob2xkLnN0YXRlKSB7XG4gICAgICAgIGN1cnJlbnRTdGF0ZSA9IGxvd2VyVGhyZXNob2xkLnN0YXRlO1xuICAgICAgICBjdXJyZW50Q29sb3IgPSBsb3dlclRocmVzaG9sZC5jb2xvcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gbGFzdCBjaGVjaywgaWYgY3VycmVudFN0YXRlIGlzIG5vdCBzZXQsIGFuZCB0aGVyZSBpcyBhIGxvd2VyIHRocmVzaG9sZCwgdXNlIHRoYXQgdmFsdWUgKGluY2x1c2l2ZSByYW5nZSB1cCB0byBUMSlcbiAgaWYgKGN1cnJlbnRTdGF0ZSA9PT0gLTEpIHtcbiAgICBjdXJyZW50U3RhdGUgPSB0aHJlc2hvbGRzWzBdLnN0YXRlO1xuICAgIGN1cnJlbnRDb2xvciA9IHRocmVzaG9sZHNbMF0uY29sb3I7XG4gIH1cbiAgY29uc29sZS5sb2coXCJSZXR1cm5pbmcgdGhyZXNob2xkIGxldmVsOiBcIiArIGN1cnJlbnRTdGF0ZSArIFwiIGNvbG9yOiBcIiArIGN1cnJlbnRDb2xvcik7XG4gIHJldHVybiB7IHRocmVzaG9sZExldmVsOiBjdXJyZW50U3RhdGUsIGNvbG9yOiBjdXJyZW50Q29sb3J9O1xufVxuXG5cbmZ1bmN0aW9uIGdldFZhbHVlQnlTdGF0TmFtZShvcGVyYXRvck5hbWU6IHN0cmluZywgZGF0YTogYW55KTogbnVtYmVyIHtcbiAgbGV0IHZhbHVlID0gZGF0YS5zdGF0cy5hdmc7XG4gIHN3aXRjaCAob3BlcmF0b3JOYW1lKSB7XG4gICAgY2FzZSBcImF2Z1wiOlxuICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmF2ZztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJjb3VudFwiOlxuICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmNvdW50O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImN1cnJlbnRcIjpcbiAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5jdXJyZW50O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImRlbHRhXCI6XG4gICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuZGVsdGE7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZGlmZlwiOlxuICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmRpZmY7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZmlyc3RcIjpcbiAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5maXJzdDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsb2dtaW5cIjpcbiAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5sb2dtaW47XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibWF4XCI6XG4gICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMubWF4O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm1pblwiOlxuICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLm1pbjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICB2YWx1ZSA9IGRhdGEubWV0cmljTmFtZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0aW1lX3N0ZXBcIjpcbiAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy50aW1lU3RlcDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJsYXN0X3RpbWVcIjpcbiAgICAgIHZhbHVlID0gZGF0YS50aW1lc3RhbXA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidG90YWxcIjpcbiAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy50b3RhbDtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuYXZnO1xuICAgICAgYnJlYWs7XG4gICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IHtcbiAgZ2V0V29yc3RTZXJpZXMsXG4gIGdldFRocmVzaG9sZExldmVsRm9yVmFsdWUsXG4gIGdldFZhbHVlQnlTdGF0TmFtZVxufTtcbiJdfQ==