System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function getWorstSeries(series1, series2) {
        var worstSeries = series1;
        var series1Value = getValueByStatName(series1.operatorName, series1);
        var series2Value = getValueByStatName(series2.operatorName, series2);
        var series1result = getThresholdLevelForValue(series1.thresholds, series1Value);
        var series2result = getThresholdLevelForValue(series2.thresholds, series2Value);
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
    function getThresholdLevelForValue(thresholds, value) {
        var colorGrey = "#808080";
        var colorWhite = "#FFFFFF";
        var currentColor = colorWhite;
        if (value === null) {
            return { thresholdLevel: 3, color: colorGrey };
        }
        var currentState = -1;
        if (typeof thresholds === "undefined") {
            return { thresholdLevel: currentState, color: colorWhite };
        }
        var thresholdCount = thresholds.length;
        if (thresholdCount === 0) {
            return { thresholdLevel: currentState, color: colorWhite };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyZXNob2xkX3Byb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90aHJlc2hvbGRfcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQXFEQSx3QkFBd0IsT0FBWSxFQUFFLE9BQVk7UUFDaEQsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDO1FBQzFCLElBQUksWUFBWSxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckUsSUFBSSxZQUFZLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNyRSxJQUFJLGFBQWEsR0FBRyx5QkFBeUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2hGLElBQUksYUFBYSxHQUFHLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFHaEYsSUFBSSxhQUFhLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQyxjQUFjLEVBQUU7WUFFL0QsV0FBVyxHQUFHLE9BQU8sQ0FBQztTQUN2QjtRQUNELElBQUksYUFBYSxDQUFDLGNBQWMsS0FBSyxDQUFDLEVBQUU7WUFFdEMsUUFBUSxhQUFhLENBQUMsY0FBYyxFQUFFO2dCQUNwQyxLQUFLLENBQUM7b0JBQ0osV0FBVyxHQUFHLE9BQU8sQ0FBQztvQkFDdEIsTUFBTTtnQkFDUixLQUFLLENBQUM7b0JBQ0osV0FBVyxHQUFHLE9BQU8sQ0FBQztvQkFDeEIsTUFBTTthQUNQO1NBQ0Y7UUFDRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOztJQUVELG1DQUFtQyxVQUFlLEVBQUUsS0FBYTtRQUMvRCxJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDMUIsSUFBSSxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksWUFBWSxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLEtB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TUFBTTtZQUNSLEtBQUssS0FBSztnQkFDUixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ3ZCLE1BQU07WUFDUixLQUFLLE1BQU07Z0JBQ1QsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ3hCLE1BQU07WUFDUixLQUFLLFdBQVc7Z0JBQ2QsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2dCQUM1QixNQUFNO1lBQ1IsS0FBSyxXQUFXO2dCQUNkLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUN2QixNQUFNO1lBQ1IsS0FBSyxPQUFPO2dCQUNWLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDekIsTUFBTTtZQUNSO2dCQUNFLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDdkIsTUFBTTtTQUNSO1FBQ0YsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuVGhpcyBzdXBwb3J0cyByYW5nZWQgc3RhdGVzXG5cblRocmVzaG9sZHMgYXJlIGV4cGVjdGVkIHRvIGJlIHNvcnRlZCBieSBhc2NlbmRpbmcgdmFsdWUsIHdoZXJlXG4gIFQwID0gbG93ZXN0IGRlY2ltYWwgdmFsdWUsIGFueSBzdGF0ZVxuICBUTiA9IGhpZ2hlc3QgZGVjaW1hbCB2YWx1ZSwgYW55IHN0YXRlXG5cbkluaXRpYWwgc3RhdGUgaXMgc2V0IHRvIFwib2tcIlxuXG5BIGNvbXBhcmlzb24gaXMgbWFkZSB1c2luZyBcImdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0b1wiIGFnYWluc3QgdGhlIHZhbHVlXG4gIElmIHZhbHVlID49IHRocmVzaG9sZFZhbHVlIHN0YXRlID0gWFxuXG5Db21wYXJpc29ucyBhcmUgbWFkZSBpbiByZXZlcnNlIG9yZGVyLCB1c2luZyB0aGUgcmFuZ2UgYmV0d2VlbiB0aGUgTnRoIChpbmNsdXNpdmUpIHRocmVzaG9sZCBhbmQgTisxIChleGNsdXNpdmUpXG4gIEluY2x1c2l2ZVZhbHVlID0gVChuKS52YWx1ZVxuICBFeGNsdXNpdmVWYWx1ZSA9IFQobisxKS52YWx1ZVxuXG5XaGVuIHRoZXJlIGlzIG5vIG4rMSB0aHJlc2hvbGQsIHRoZSBoaWdoZXN0IHZhbHVlIHRocmVzaG9sZCBUKG4pLCBhIHNpbXBsZSBpbmNsdXNpdmUgPj0gY29tcGFyaXNvbiBpcyBtYWRlXG5cbiAgRXhhbXBsZSAxOiAodHlwaWNhbCBsaW5lYXIpXG4gICAgVDAgLSA1LCBva1xuICAgIFQxIC0gMTAsIHdhcm5pbmdcbiAgICBUMiAtIDIwLCBjcml0aWNhbFxuXG4gIFZhbHVlID49IDIwIChWYWx1ZSA+PSBUMilcbiAgMTAgPD0gVmFsdWUgPCAyMCAgKFQxIDw9IFZhbHVlIDwgVDIpXG4gIDUgPD0gVmFsdWUgPCAxMCAgIChUMCA8PSBWYWx1ZSA8IFQxKVxuXG4gIEV4YW1wbGUgMjogKHJldmVyc2UgbGluZWFyKVxuICAgIFQwIC0gNTAsIGNyaXRpY2FsXG4gICAgVDEgLSA5MCwgd2FybmluZ1xuICAgIFQyIC0gMTAwLCBva1xuXG4gIFZhbHVlID49IDEwMFxuICA5MCA8PSB2YWx1ZSA8IDEwMFxuICA1MCA8PSB2YWx1ZSA8IDkwXG5cbiAgRXhhbXBsZSAzOiAoYm91bmRlZClcbiAgICBUMCAtIDUwLCBjcml0aWNhbFxuICAgIFQxIC0gNjAsIHdhcm5pbmdcbiAgICBUMiAtIDcwLCBva1xuICAgIFQzIC0gODAsIHdhcm5pbmdcbiAgICBUNCAtIDkwLCBjcml0aWNhbFxuXG4gICAgVmFsdWUgPj0gOTBcbiAgICA4MCA8PSBWYWx1ZSA8IDkwXG4gICAgNzAgPD0gVmFsdWUgPCA4MFxuICAgIDYwIDw9IFZhbHVlIDwgNzBcbiAgICA1MCA8PSBWYWx1ZSA8IDYwXG5cblRoZSBcIndvcnN0XCIgc3RhdGUgaXMgcmV0dXJuZWQgYWZ0ZXIgY2hlY2tpbmcgZXZlcnkgdGhyZXNob2xkIHJhbmdlXG5cbiovXG5mdW5jdGlvbiBnZXRXb3JzdFNlcmllcyhzZXJpZXMxOiBhbnksIHNlcmllczI6IGFueSk6IGFueSB7XG4gIHZhciB3b3JzdFNlcmllcyA9IHNlcmllczE7XG4gIHZhciBzZXJpZXMxVmFsdWUgPSBnZXRWYWx1ZUJ5U3RhdE5hbWUoc2VyaWVzMS5vcGVyYXRvck5hbWUsIHNlcmllczEpO1xuICB2YXIgc2VyaWVzMlZhbHVlID0gZ2V0VmFsdWVCeVN0YXROYW1lKHNlcmllczIub3BlcmF0b3JOYW1lLCBzZXJpZXMyKTtcbiAgdmFyIHNlcmllczFyZXN1bHQgPSBnZXRUaHJlc2hvbGRMZXZlbEZvclZhbHVlKHNlcmllczEudGhyZXNob2xkcywgc2VyaWVzMVZhbHVlKTtcbiAgdmFyIHNlcmllczJyZXN1bHQgPSBnZXRUaHJlc2hvbGRMZXZlbEZvclZhbHVlKHNlcmllczIudGhyZXNob2xkcywgc2VyaWVzMlZhbHVlKTtcblxuICAvLyBTdGF0ZSAzIGlzIFVua25vd24gYW5kIGlzIG5vdCBiZSB3b3JzZSB0aGFuIENSSVRJQ0FMIChzdGF0ZSAyKVxuICBpZiAoc2VyaWVzMnJlc3VsdC50aHJlc2hvbGRMZXZlbCA+IHNlcmllczFyZXN1bHQudGhyZXNob2xkTGV2ZWwpIHtcbiAgICAvLyBzZXJpZXMyIGhhcyBoaWdoZXIgdGhyZXNob2xkIHZpb2xhdGlvblxuICAgIHdvcnN0U2VyaWVzID0gc2VyaWVzMjtcbiAgfVxuICBpZiAoc2VyaWVzMXJlc3VsdC50aHJlc2hvbGRMZXZlbCA9PT0gMykge1xuICAgIC8vIHNlcmllczEgaXMgaW4gc3RhdGUgdW5rbm93biwgY2hlY2sgaWYgc2VyaWVzMiBpcyBpbiBzdGF0ZSAxIG9yIDJcbiAgICBzd2l0Y2ggKHNlcmllczJyZXN1bHQudGhyZXNob2xkTGV2ZWwpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgd29yc3RTZXJpZXMgPSBzZXJpZXMyO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgd29yc3RTZXJpZXMgPSBzZXJpZXMyO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB3b3JzdFNlcmllcztcbn1cblxuZnVuY3Rpb24gZ2V0VGhyZXNob2xkTGV2ZWxGb3JWYWx1ZSh0aHJlc2hvbGRzOiBhbnksIHZhbHVlOiBudW1iZXIpOiB7dGhyZXNob2xkTGV2ZWw6IG51bWJlciwgY29sb3I6IHN0cmluZ30ge1xuICBsZXQgY29sb3JHcmV5ID0gXCIjODA4MDgwXCI7IC8vIFwiZ3JleVwiXG4gIGxldCBjb2xvcldoaXRlID0gXCIjRkZGRkZGXCI7IC8vIFwid2hpdGVcIlxuICBsZXQgY3VycmVudENvbG9yID0gY29sb3JXaGl0ZTtcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcImdldFRocmVzaG9sZExldmVsRm9yVmFsdWU6IE5PIERBVEFcIik7XG4gICAgcmV0dXJuIHsgdGhyZXNob2xkTGV2ZWw6IDMsIGNvbG9yOiBjb2xvckdyZXl9OyAvLyBObyBEYXRhXG4gIH1cbiAgLy8gYXNzdW1lIFVOS05PV04gc3RhdGVcbiAgbGV0IGN1cnJlbnRTdGF0ZSA9IC0xO1xuICAvLyBza2lwIGV2YWx1YXRpb24gd2hlbiB0aGVyZSBhcmUgbm8gdGhyZXNob2xkc1xuICBpZiAodHlwZW9mIHRocmVzaG9sZHMgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiZ2V0VGhyZXNob2xkTGV2ZWxGb3JWYWx1ZTogTk8gdGhyZXNob2xkcyBkZWZpbmVkXCIpO1xuICAgIHJldHVybiB7IHRocmVzaG9sZExldmVsOiBjdXJyZW50U3RhdGUsIGNvbG9yOiBjb2xvcldoaXRlfTtcbiAgfVxuICAvLyB0ZXN0IFwiTnRoXCIgdGhyZXNob2xkXG4gIGxldCB0aHJlc2hvbGRDb3VudCA9IHRocmVzaG9sZHMubGVuZ3RoO1xuICBpZiAodGhyZXNob2xkQ291bnQgPT09IDApIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiZ2V0VGhyZXNob2xkTGV2ZWxGb3JWYWx1ZTogTk8gdGhyZXNob2xkcyBkZWZpbmVkXCIpO1xuICAgIHJldHVybiB7IHRocmVzaG9sZExldmVsOiBjdXJyZW50U3RhdGUsIGNvbG9yOiBjb2xvcldoaXRlfTtcbiAgfVxuICBsZXQgYVRocmVzaG9sZCA9IHRocmVzaG9sZHNbdGhyZXNob2xkQ291bnQgLSAxXTtcbiAgaWYgKHZhbHVlID49IGFUaHJlc2hvbGQudmFsdWUpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiZ2V0VGhyZXNob2xkTGV2ZWxGb3JWYWx1ZTogdmFsdWUgXCIgKyB2YWx1ZSArIFwiIGdlIFwiICsgYVRocmVzaG9sZC52YWx1ZSk7XG4gICAgY3VycmVudFN0YXRlID0gYVRocmVzaG9sZC5zdGF0ZTtcbiAgICBjdXJyZW50Q29sb3IgPSBhVGhyZXNob2xkLmNvbG9yO1xuICB9XG4gIC8vIGlmIHRoZXJlJ3Mgb25lIHRocmVzaG9sZCwganVzdCByZXR1cm4gdGhlIHJlc3VsdFxuICBpZiAodGhyZXNob2xkcy5sZW5ndGggPT09IDEpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwiZ2V0VGhyZXNob2xkTGV2ZWxGb3JWYWx1ZTogc2luZ2xlIHRocmVzaG9sZCwgcmV0dXJuaW5nIHN0YXRlIFwiICsgY3VycmVudFN0YXRlKTtcbiAgICByZXR1cm4geyB0aHJlc2hvbGRMZXZlbDogY3VycmVudFN0YXRlLCBjb2xvcjogY3VycmVudENvbG9yfTtcbiAgfVxuICAvLyBub3cgdGVzdCBpbiByZXZlcnNlXG4gIGZvciAobGV0IGkgPSB0aHJlc2hvbGRDb3VudCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICBsZXQgdXBwZXJUaHJlc2hvbGQgPSB0aHJlc2hvbGRzW2ldO1xuICAgIGxldCBsb3dlclRocmVzaG9sZCA9IHRocmVzaG9sZHNbaSAtIDFdO1xuICAgIC8vY29uc29sZS5sb2coXCJsb3dlclRocmVzaG9sZCA9IFwiICsgbG93ZXJUaHJlc2hvbGQudmFsdWUpO1xuICAgIC8vY29uc29sZS5sb2coXCJ1cHBlclRocmVzaG9sZCA9IFwiICsgdXBwZXJUaHJlc2hvbGQudmFsdWUpO1xuICAgIGlmICgobG93ZXJUaHJlc2hvbGQudmFsdWUgPD0gdmFsdWUpICYmICh2YWx1ZSA8IHVwcGVyVGhyZXNob2xkLnZhbHVlKSkge1xuICAgICAgLy9jb25zb2xlLmxvZyhcImdldFRocmVzaG9sZExldmVsRm9yVmFsdWU6IHZhbHVlIFwiICsgdmFsdWUgKyBcIiBpcyBiZXR3ZWVuIFwiICsgbG93ZXJUaHJlc2hvbGQudmFsdWUgKyBcIiBhbmQgXCIgKyB1cHBlclRocmVzaG9sZC52YWx1ZSk7XG4gICAgICBpZiAoY3VycmVudFN0YXRlIDwgbG93ZXJUaHJlc2hvbGQuc3RhdGUpIHtcbiAgICAgICAgY3VycmVudFN0YXRlID0gbG93ZXJUaHJlc2hvbGQuc3RhdGU7XG4gICAgICAgIGN1cnJlbnRDb2xvciA9IGxvd2VyVGhyZXNob2xkLmNvbG9yO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvL2NvbnNvbGUubG9nKFwiUmV0dXJuaW5nIHRocmVzaG9sZCBsZXZlbDogXCIgKyBjdXJyZW50U3RhdGUpO1xuICByZXR1cm4geyB0aHJlc2hvbGRMZXZlbDogY3VycmVudFN0YXRlLCBjb2xvcjogY3VycmVudENvbG9yfTtcbn1cblxuXG5mdW5jdGlvbiBnZXRWYWx1ZUJ5U3RhdE5hbWUob3BlcmF0b3JOYW1lOiBzdHJpbmcsIGRhdGE6IGFueSk6IG51bWJlciB7XG4gIGxldCB2YWx1ZSA9IGRhdGEuc3RhdHMuYXZnO1xuICBzd2l0Y2ggKG9wZXJhdG9yTmFtZSkge1xuICAgIGNhc2UgXCJhdmdcIjpcbiAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5hdmc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiY291bnRcIjpcbiAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5jb3VudDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJjdXJyZW50XCI6XG4gICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuY3VycmVudDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJkZWx0YVwiOlxuICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmRlbHRhO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImRpZmZcIjpcbiAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5kaWZmO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImZpcnN0XCI6XG4gICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuZmlyc3Q7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibG9nbWluXCI6XG4gICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMubG9nbWluO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm1heFwiOlxuICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLm1heDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJtaW5cIjpcbiAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5taW47XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgdmFsdWUgPSBkYXRhLm1ldHJpY05hbWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwidGltZV9zdGVwXCI6XG4gICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMudGltZVN0ZXA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibGFzdF90aW1lXCI6XG4gICAgICB2YWx1ZSA9IGRhdGEudGltZXN0YW1wO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRvdGFsXCI6XG4gICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMudG90YWw7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmF2ZztcbiAgICAgIGJyZWFrO1xuICAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCB7XG4gIGdldFdvcnN0U2VyaWVzLFxuICBnZXRUaHJlc2hvbGRMZXZlbEZvclZhbHVlLFxuICBnZXRWYWx1ZUJ5U3RhdE5hbWVcbn07XG4iXX0=