System.register(["./ctrl", "app/plugins/sdk"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ctrl_1, sdk_1;
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
//# sourceMappingURL=module.js.map