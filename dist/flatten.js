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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdHRlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mbGF0dGVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUlBLGlCQUF3QixNQUFNLEVBQUUsSUFBSTtRQUNoQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUVsQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQztRQUN0QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDckIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWhCLGNBQWMsTUFBTSxFQUFFLElBQUk7WUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHO2dCQUNyQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLFFBQVEsR0FBRyxJQUFJLEtBQUssaUJBQWlCLENBQUM7Z0JBRTFDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLFNBQVMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFFakQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ2hCLFFBQVEsR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2lCQUMvQjtnQkFFRCxJQUFJLENBQUMsT0FBTyxJQUFJLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sSUFBSSxZQUFZLEdBQUcsUUFBUSxFQUFFO29CQUM5RSxFQUFFLFlBQVksQ0FBQztvQkFDZixPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQzlCO2dCQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVuQixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE0LCBIdWdoIEtlbm5lZHlcbi8vIEJhc2VkIG9uIGNvZGUgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vaHVnaHNrL2ZsYXQvYmxvYi9tYXN0ZXIvaW5kZXguanNcbi8vXG5cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuKHRhcmdldCwgb3B0cyk6IGFueSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgICB2YXIgZGVsaW1pdGVyID0gb3B0cy5kZWxpbWl0ZXIgfHwgXCIuXCI7XG4gICAgdmFyIG1heERlcHRoID0gb3B0cy5tYXhEZXB0aCB8fCAzO1xuICAgIHZhciBjdXJyZW50RGVwdGggPSAxO1xuICAgIHZhciBvdXRwdXQgPSB7fTtcblxuICAgIGZ1bmN0aW9uIHN0ZXAob2JqZWN0LCBwcmV2KSB7XG4gICAgICAgIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAgICAgICAgIHZhciBpc2FycmF5ID0gb3B0cy5zYWZlICYmIEFycmF5LmlzQXJyYXkodmFsdWUpO1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICAgICAgICAgICAgdmFyIGlzb2JqZWN0ID0gdHlwZSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIjtcblxuICAgICAgICAgICAgdmFyIG5ld0tleSA9IHByZXYgPyBwcmV2ICsgZGVsaW1pdGVyICsga2V5IDoga2V5O1xuXG4gICAgICAgICAgICBpZiAoIW9wdHMubWF4RGVwdGgpIHtcbiAgICAgICAgICAgICAgICBtYXhEZXB0aCA9IGN1cnJlbnREZXB0aCArIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNhcnJheSAmJiBpc29iamVjdCAmJiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoICYmIGN1cnJlbnREZXB0aCA8IG1heERlcHRoKSB7XG4gICAgICAgICAgICAgICAgKytjdXJyZW50RGVwdGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0ZXAodmFsdWUsIG5ld0tleSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG91dHB1dFtuZXdLZXldID0gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0ZXAodGFyZ2V0LCBudWxsKTtcblxuICAgIHJldHVybiBvdXRwdXQ7XG59XG4iXX0=