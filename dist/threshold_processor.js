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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyZXNob2xkX3Byb2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90aHJlc2hvbGRfcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQXFEQSx3QkFBd0IsT0FBWSxFQUFFLE9BQVksRUFBRSxZQUFvQjtRQUN0RSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFDMUIsSUFBSSxZQUFZLEdBQUcsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNyRSxJQUFJLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3JFLElBQUksYUFBYSxHQUFHLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzlGLElBQUksYUFBYSxHQUFHLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRzlGLElBQUksYUFBYSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUMsY0FBYyxFQUFFO1lBRS9ELFdBQVcsR0FBRyxPQUFPLENBQUM7U0FDdkI7UUFDRCxJQUFJLGFBQWEsQ0FBQyxjQUFjLEtBQUssQ0FBQyxFQUFFO1lBRXRDLFFBQVEsYUFBYSxDQUFDLGNBQWMsRUFBRTtnQkFDcEMsS0FBSyxDQUFDO29CQUNKLFdBQVcsR0FBRyxPQUFPLENBQUM7b0JBQ3RCLE1BQU07Z0JBQ1IsS0FBSyxDQUFDO29CQUNKLFdBQVcsR0FBRyxPQUFPLENBQUM7b0JBQ3hCLE1BQU07YUFDUDtTQUNGO1FBQ0QsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQzs7SUFFRCxtQ0FBbUMsVUFBZSxFQUFFLEtBQWEsRUFBRSxZQUFvQjtRQUNyRixJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDMUIsSUFBSSxZQUFZLEdBQUcsWUFBWSxDQUFDO1FB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O2dCQUN4QixNQUFNO1lBQ1IsS0FBSyxPQUFPO2dCQUNWLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDekIsTUFBTTtZQUNSLEtBQUssUUFBUTtnQkFDWCxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQzFCLE1BQU07WUFDUixLQUFLLEtBQUs7Z0JBQ1IsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO2dCQUN2QixNQUFNO1lBQ1IsS0FBSyxLQUFLO2dCQUNSLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDdkIsTUFBTTtZQUNSLEtBQUssTUFBTTtnQkFDVCxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDeEIsTUFBTTtZQUNSLEtBQUssV0FBVztnQkFDZCxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7Z0JBQzVCLE1BQU07WUFDUixLQUFLLFdBQVc7Z0JBQ2QsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ3ZCLE1BQU07WUFDUixLQUFLLE9BQU87Z0JBQ1YsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUN6QixNQUFNO1lBQ1I7Z0JBQ0UsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO2dCQUN2QixNQUFNO1NBQ1I7UUFDRixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5UaGlzIHN1cHBvcnRzIHJhbmdlZCBzdGF0ZXNcblxuVGhyZXNob2xkcyBhcmUgZXhwZWN0ZWQgdG8gYmUgc29ydGVkIGJ5IGFzY2VuZGluZyB2YWx1ZSwgd2hlcmVcbiAgVDAgPSBsb3dlc3QgZGVjaW1hbCB2YWx1ZSwgYW55IHN0YXRlXG4gIFROID0gaGlnaGVzdCBkZWNpbWFsIHZhbHVlLCBhbnkgc3RhdGVcblxuSW5pdGlhbCBzdGF0ZSBpcyBzZXQgdG8gXCJva1wiXG5cbkEgY29tcGFyaXNvbiBpcyBtYWRlIHVzaW5nIFwiZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvXCIgYWdhaW5zdCB0aGUgdmFsdWVcbiAgSWYgdmFsdWUgPj0gdGhyZXNob2xkVmFsdWUgc3RhdGUgPSBYXG5cbkNvbXBhcmlzb25zIGFyZSBtYWRlIGluIHJldmVyc2Ugb3JkZXIsIHVzaW5nIHRoZSByYW5nZSBiZXR3ZWVuIHRoZSBOdGggKGluY2x1c2l2ZSkgdGhyZXNob2xkIGFuZCBOKzEgKGV4Y2x1c2l2ZSlcbiAgSW5jbHVzaXZlVmFsdWUgPSBUKG4pLnZhbHVlXG4gIEV4Y2x1c2l2ZVZhbHVlID0gVChuKzEpLnZhbHVlXG5cbldoZW4gdGhlcmUgaXMgbm8gbisxIHRocmVzaG9sZCwgdGhlIGhpZ2hlc3QgdmFsdWUgdGhyZXNob2xkIFQobiksIGEgc2ltcGxlIGluY2x1c2l2ZSA+PSBjb21wYXJpc29uIGlzIG1hZGVcblxuICBFeGFtcGxlIDE6ICh0eXBpY2FsIGxpbmVhcilcbiAgICBUMCAtIDUsIG9rXG4gICAgVDEgLSAxMCwgd2FybmluZ1xuICAgIFQyIC0gMjAsIGNyaXRpY2FsXG5cbiAgVmFsdWUgPj0gMjAgKFZhbHVlID49IFQyKVxuICAxMCA8PSBWYWx1ZSA8IDIwICAoVDEgPD0gVmFsdWUgPCBUMilcbiAgNSA8PSBWYWx1ZSA8IDEwICAgKFQwIDw9IFZhbHVlIDwgVDEpXG5cbiAgRXhhbXBsZSAyOiAocmV2ZXJzZSBsaW5lYXIpXG4gICAgVDAgLSA1MCwgY3JpdGljYWxcbiAgICBUMSAtIDkwLCB3YXJuaW5nXG4gICAgVDIgLSAxMDAsIG9rXG5cbiAgVmFsdWUgPj0gMTAwXG4gIDkwIDw9IHZhbHVlIDwgMTAwXG4gIDUwIDw9IHZhbHVlIDwgOTBcblxuICBFeGFtcGxlIDM6IChib3VuZGVkKVxuICAgIFQwIC0gNTAsIGNyaXRpY2FsXG4gICAgVDEgLSA2MCwgd2FybmluZ1xuICAgIFQyIC0gNzAsIG9rXG4gICAgVDMgLSA4MCwgd2FybmluZ1xuICAgIFQ0IC0gOTAsIGNyaXRpY2FsXG5cbiAgICBWYWx1ZSA+PSA5MFxuICAgIDgwIDw9IFZhbHVlIDwgOTBcbiAgICA3MCA8PSBWYWx1ZSA8IDgwXG4gICAgNjAgPD0gVmFsdWUgPCA3MFxuICAgIDUwIDw9IFZhbHVlIDwgNjBcblxuVGhlIFwid29yc3RcIiBzdGF0ZSBpcyByZXR1cm5lZCBhZnRlciBjaGVja2luZyBldmVyeSB0aHJlc2hvbGQgcmFuZ2VcblxuKi9cbmZ1bmN0aW9uIGdldFdvcnN0U2VyaWVzKHNlcmllczE6IGFueSwgc2VyaWVzMjogYW55LCBkZWZhdWx0Q29sb3I6IHN0cmluZyk6IGFueSB7XG4gIHZhciB3b3JzdFNlcmllcyA9IHNlcmllczE7XG4gIHZhciBzZXJpZXMxVmFsdWUgPSBnZXRWYWx1ZUJ5U3RhdE5hbWUoc2VyaWVzMS5vcGVyYXRvck5hbWUsIHNlcmllczEpO1xuICB2YXIgc2VyaWVzMlZhbHVlID0gZ2V0VmFsdWVCeVN0YXROYW1lKHNlcmllczIub3BlcmF0b3JOYW1lLCBzZXJpZXMyKTtcbiAgdmFyIHNlcmllczFyZXN1bHQgPSBnZXRUaHJlc2hvbGRMZXZlbEZvclZhbHVlKHNlcmllczEudGhyZXNob2xkcywgc2VyaWVzMVZhbHVlLCBkZWZhdWx0Q29sb3IpO1xuICB2YXIgc2VyaWVzMnJlc3VsdCA9IGdldFRocmVzaG9sZExldmVsRm9yVmFsdWUoc2VyaWVzMi50aHJlc2hvbGRzLCBzZXJpZXMyVmFsdWUsIGRlZmF1bHRDb2xvcik7XG5cbiAgLy8gU3RhdGUgMyBpcyBVbmtub3duIGFuZCBpcyBub3QgYmUgd29yc2UgdGhhbiBDUklUSUNBTCAoc3RhdGUgMilcbiAgaWYgKHNlcmllczJyZXN1bHQudGhyZXNob2xkTGV2ZWwgPiBzZXJpZXMxcmVzdWx0LnRocmVzaG9sZExldmVsKSB7XG4gICAgLy8gc2VyaWVzMiBoYXMgaGlnaGVyIHRocmVzaG9sZCB2aW9sYXRpb25cbiAgICB3b3JzdFNlcmllcyA9IHNlcmllczI7XG4gIH1cbiAgaWYgKHNlcmllczFyZXN1bHQudGhyZXNob2xkTGV2ZWwgPT09IDMpIHtcbiAgICAvLyBzZXJpZXMxIGlzIGluIHN0YXRlIHVua25vd24sIGNoZWNrIGlmIHNlcmllczIgaXMgaW4gc3RhdGUgMSBvciAyXG4gICAgc3dpdGNoIChzZXJpZXMycmVzdWx0LnRocmVzaG9sZExldmVsKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHdvcnN0U2VyaWVzID0gc2VyaWVzMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHdvcnN0U2VyaWVzID0gc2VyaWVzMjtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gd29yc3RTZXJpZXM7XG59XG5cbmZ1bmN0aW9uIGdldFRocmVzaG9sZExldmVsRm9yVmFsdWUodGhyZXNob2xkczogYW55LCB2YWx1ZTogbnVtYmVyLCBkZWZhdWx0Q29sb3I6IHN0cmluZyk6IHt0aHJlc2hvbGRMZXZlbDogbnVtYmVyLCBjb2xvcjogc3RyaW5nfSB7XG4gIGxldCBjb2xvckdyZXkgPSBcIiM4MDgwODBcIjsgLy8gXCJncmV5XCJcbiAgbGV0IGN1cnJlbnRDb2xvciA9IGRlZmF1bHRDb2xvcjtcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHsgdGhyZXNob2xkTGV2ZWw6IDMsIGNvbG9yOiBjb2xvckdyZXl9OyAvLyBObyBEYXRhXG4gIH1cbiAgLy8gYXNzdW1lIFVOS05PV04gc3RhdGVcbiAgbGV0IGN1cnJlbnRTdGF0ZSA9IC0xO1xuICAvLyBza2lwIGV2YWx1YXRpb24gd2hlbiB0aGVyZSBhcmUgbm8gdGhyZXNob2xkc1xuICBpZiAodHlwZW9mIHRocmVzaG9sZHMgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4geyB0aHJlc2hvbGRMZXZlbDogY3VycmVudFN0YXRlLCBjb2xvcjogZGVmYXVsdENvbG9yfTtcbiAgfVxuICAvLyB0ZXN0IFwiTnRoXCIgdGhyZXNob2xkXG4gIGxldCB0aHJlc2hvbGRDb3VudCA9IHRocmVzaG9sZHMubGVuZ3RoO1xuICBpZiAodGhyZXNob2xkQ291bnQgPT09IDApIHtcbiAgICByZXR1cm4geyB0aHJlc2hvbGRMZXZlbDogY3VycmVudFN0YXRlLCBjb2xvcjogZGVmYXVsdENvbG9yfTtcbiAgfVxuICBsZXQgYVRocmVzaG9sZCA9IHRocmVzaG9sZHNbdGhyZXNob2xkQ291bnQgLSAxXTtcbiAgaWYgKHZhbHVlID49IGFUaHJlc2hvbGQudmFsdWUpIHtcbiAgICBjdXJyZW50U3RhdGUgPSBhVGhyZXNob2xkLnN0YXRlO1xuICAgIGN1cnJlbnRDb2xvciA9IGFUaHJlc2hvbGQuY29sb3I7XG4gIH1cbiAgLy8gaWYgdGhlcmUncyBvbmUgdGhyZXNob2xkLCBqdXN0IHJldHVybiB0aGUgcmVzdWx0XG4gIGlmICh0aHJlc2hvbGRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiB7IHRocmVzaG9sZExldmVsOiBjdXJyZW50U3RhdGUsIGNvbG9yOiBjdXJyZW50Q29sb3J9O1xuICB9XG4gIC8vIG5vdyB0ZXN0IGluIHJldmVyc2VcbiAgZm9yIChsZXQgaSA9IHRocmVzaG9sZENvdW50IC0gMTsgaSA+IDA7IGktLSkge1xuICAgIGxldCB1cHBlclRocmVzaG9sZCA9IHRocmVzaG9sZHNbaV07XG4gICAgbGV0IGxvd2VyVGhyZXNob2xkID0gdGhyZXNob2xkc1tpIC0gMV07XG4gICAgaWYgKChsb3dlclRocmVzaG9sZC52YWx1ZSA8PSB2YWx1ZSkgJiYgKHZhbHVlIDwgdXBwZXJUaHJlc2hvbGQudmFsdWUpKSB7XG4gICAgICBpZiAoY3VycmVudFN0YXRlIDwgbG93ZXJUaHJlc2hvbGQuc3RhdGUpIHtcbiAgICAgICAgY3VycmVudFN0YXRlID0gbG93ZXJUaHJlc2hvbGQuc3RhdGU7XG4gICAgICAgIGN1cnJlbnRDb2xvciA9IGxvd2VyVGhyZXNob2xkLmNvbG9yO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBsYXN0IGNoZWNrLCBpZiBjdXJyZW50U3RhdGUgaXMgbm90IHNldCwgYW5kIHRoZXJlIGlzIGEgbG93ZXIgdGhyZXNob2xkLCB1c2UgdGhhdCB2YWx1ZSAoaW5jbHVzaXZlIHJhbmdlIHVwIHRvIFQxKVxuICBpZiAoY3VycmVudFN0YXRlID09PSAtMSkge1xuICAgIGN1cnJlbnRTdGF0ZSA9IHRocmVzaG9sZHNbMF0uc3RhdGU7XG4gICAgY3VycmVudENvbG9yID0gdGhyZXNob2xkc1swXS5jb2xvcjtcbiAgfVxuICBjb25zb2xlLmxvZyhcIlJldHVybmluZyB0aHJlc2hvbGQgbGV2ZWw6IFwiICsgY3VycmVudFN0YXRlICsgXCIgY29sb3I6IFwiICsgY3VycmVudENvbG9yKTtcbiAgcmV0dXJuIHsgdGhyZXNob2xkTGV2ZWw6IGN1cnJlbnRTdGF0ZSwgY29sb3I6IGN1cnJlbnRDb2xvcn07XG59XG5cblxuZnVuY3Rpb24gZ2V0VmFsdWVCeVN0YXROYW1lKG9wZXJhdG9yTmFtZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBudW1iZXIge1xuICBsZXQgdmFsdWUgPSBkYXRhLnN0YXRzLmF2ZztcbiAgc3dpdGNoIChvcGVyYXRvck5hbWUpIHtcbiAgICBjYXNlIFwiYXZnXCI6XG4gICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuYXZnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImNvdW50XCI6XG4gICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuY291bnQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiY3VycmVudFwiOlxuICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmN1cnJlbnQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiZGVsdGFcIjpcbiAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5kZWx0YTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJkaWZmXCI6XG4gICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMuZGlmZjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJmaXJzdFwiOlxuICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmZpcnN0O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxvZ21pblwiOlxuICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLmxvZ21pbjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJtYXhcIjpcbiAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5tYXg7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwibWluXCI6XG4gICAgICB2YWx1ZSA9IGRhdGEuc3RhdHMubWluO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIm5hbWVcIjpcbiAgICAgIHZhbHVlID0gZGF0YS5tZXRyaWNOYW1lO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcInRpbWVfc3RlcFwiOlxuICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLnRpbWVTdGVwO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImxhc3RfdGltZVwiOlxuICAgICAgdmFsdWUgPSBkYXRhLnRpbWVzdGFtcDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJ0b3RhbFwiOlxuICAgICAgdmFsdWUgPSBkYXRhLnN0YXRzLnRvdGFsO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHZhbHVlID0gZGF0YS5zdGF0cy5hdmc7XG4gICAgICBicmVhaztcbiAgIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQge1xuICBnZXRXb3JzdFNlcmllcyxcbiAgZ2V0VGhyZXNob2xkTGV2ZWxGb3JWYWx1ZSxcbiAgZ2V0VmFsdWVCeVN0YXROYW1lXG59O1xuIl19