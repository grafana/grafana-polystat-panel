System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function flatten(target, opts) {
        opts = opts || {};
        var delimiter = opts.delimiter || ".";
        var maxDepth = opts.maxDepth || 3;
        var currentDepth = 1;
        var output = {};
        function step(object, prev) {
            Object.keys(object).forEach(function (key) {
                var value = object[key];
                var isarray = opts.safe && Array.isArray(value);
                var type = Object.prototype.toString.call(value);
                var isobject = type === "[object Object]";
                var newKey = prev ? prev + delimiter + key : key;
                if (!opts.maxDepth) {
                    maxDepth = currentDepth + 1;
                }
                if (!isarray && isobject && Object.keys(value).length && currentDepth < maxDepth) {
                    ++currentDepth;
                    return step(value, newKey);
                }
                output[newKey] = value;
            });
        }
        step(target, null);
        return output;
    }
    exports_1("flatten", flatten);
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdHRlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mbGF0dGVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUlBLFNBQWdCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSTtRQUNoQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUVsQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQztRQUN0QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDckIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWhCLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJO1lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRztnQkFDckMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hELElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakQsSUFBSSxRQUFRLEdBQUcsSUFBSSxLQUFLLGlCQUFpQixDQUFDO2dCQUUxQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBRWpELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNoQixRQUFRLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztpQkFDL0I7Z0JBRUQsSUFBSSxDQUFDLE9BQU8sSUFBSSxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksWUFBWSxHQUFHLFFBQVEsRUFBRTtvQkFDOUUsRUFBRSxZQUFZLENBQUM7b0JBQ2YsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUM5QjtnQkFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFbkIsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNCwgSHVnaCBLZW5uZWR5XG4vLyBCYXNlZCBvbiBjb2RlIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2h1Z2hzay9mbGF0L2Jsb2IvbWFzdGVyL2luZGV4LmpzXG4vL1xuXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbih0YXJnZXQsIG9wdHMpOiBhbnkge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgdmFyIGRlbGltaXRlciA9IG9wdHMuZGVsaW1pdGVyIHx8IFwiLlwiO1xuICAgIHZhciBtYXhEZXB0aCA9IG9wdHMubWF4RGVwdGggfHwgMztcbiAgICB2YXIgY3VycmVudERlcHRoID0gMTtcbiAgICB2YXIgb3V0cHV0ID0ge307XG5cbiAgICBmdW5jdGlvbiBzdGVwKG9iamVjdCwgcHJldikge1xuICAgICAgICBPYmplY3Qua2V5cyhvYmplY3QpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgICB2YXIgaXNhcnJheSA9IG9wdHMuc2FmZSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbiAgICAgICAgICAgIHZhciB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgICAgICAgICAgIHZhciBpc29iamVjdCA9IHR5cGUgPT09IFwiW29iamVjdCBPYmplY3RdXCI7XG5cbiAgICAgICAgICAgIHZhciBuZXdLZXkgPSBwcmV2ID8gcHJldiArIGRlbGltaXRlciArIGtleSA6IGtleTtcblxuICAgICAgICAgICAgaWYgKCFvcHRzLm1heERlcHRoKSB7XG4gICAgICAgICAgICAgICAgbWF4RGVwdGggPSBjdXJyZW50RGVwdGggKyAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzYXJyYXkgJiYgaXNvYmplY3QgJiYgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCAmJiBjdXJyZW50RGVwdGggPCBtYXhEZXB0aCkge1xuICAgICAgICAgICAgICAgICsrY3VycmVudERlcHRoO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGVwKHZhbHVlLCBuZXdLZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvdXRwdXRbbmV3S2V5XSA9IHZhbHVlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGVwKHRhcmdldCwgbnVsbCk7XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufVxuIl19