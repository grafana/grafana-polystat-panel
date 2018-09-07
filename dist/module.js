System.register(["./ctrl", "app/plugins/sdk"], function (exports_1, context_1) {
    "use strict";
    var ctrl_1, sdk_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (ctrl_1_1) {
                ctrl_1 = ctrl_1_1;
            },
            function (sdk_1_1) {
                sdk_1 = sdk_1_1;
            }
        ],
        execute: function () {
            exports_1("PanelCtrl", ctrl_1.D3PolystatPanelCtrl);
            sdk_1.loadPluginCss({
                dark: "plugins/grafana-polystat-panel/css/polystat.dark.css",
                light: "plugins/grafana-polystat-panel/css/polystat.light.css"
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OzttQ0FFUSwwQkFBbUI7WUFHM0IsbUJBQWEsQ0FBQztnQkFDWixJQUFJLEVBQUUsc0RBQXNEO2dCQUM1RCxLQUFLLEVBQUUsdURBQXVEO2FBQy9ELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XG5cbmltcG9ydCB7RDNQb2x5c3RhdFBhbmVsQ3RybH0gZnJvbSAgXCIuL2N0cmxcIjtcbmltcG9ydCB7bG9hZFBsdWdpbkNzc30gZnJvbSBcImFwcC9wbHVnaW5zL3Nka1wiO1xuXG5sb2FkUGx1Z2luQ3NzKHtcbiAgZGFyazogXCJwbHVnaW5zL2dyYWZhbmEtcG9seXN0YXQtcGFuZWwvY3NzL3BvbHlzdGF0LmRhcmsuY3NzXCIsXG4gIGxpZ2h0OiBcInBsdWdpbnMvZ3JhZmFuYS1wb2x5c3RhdC1wYW5lbC9jc3MvcG9seXN0YXQubGlnaHQuY3NzXCJcbn0pO1xuXG5leHBvcnQge1xuICBEM1BvbHlzdGF0UGFuZWxDdHJsIGFzIFBhbmVsQ3RybFxufTtcbiJdfQ==