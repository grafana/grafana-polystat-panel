import { D3PolystatPanelCtrl } from './ctrl';
import { loadPluginCss } from 'grafana/app/plugins/sdk';

// Registers an angular directive
import 'thresholdsCtrl';

loadPluginCss({
  dark: 'plugins/grafana-polystat-panel/styles/dark.css',
  light: 'plugins/grafana-polystat-panel/styles/light.css',
});

export { D3PolystatPanelCtrl as PanelCtrl };
