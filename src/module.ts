import { D3PolystatPanelCtrl } from './ctrl';
import { loadPluginCss } from 'grafana/app/plugins/sdk';

loadPluginCss({
  dark: 'plugins/grafana-polystat-panel/css/polystat.dark.css',
  light: 'plugins/grafana-polystat-panel/css/polystat.light.css',
});

export { D3PolystatPanelCtrl as PanelCtrl };
