import { PanelModel } from '@grafana/data';

import { PolystatOptions } from './components/types';

export const PolystatPanelChangedHandler = (
  panel: PanelModel<Partial<PolystatOptions>> | any,
  prevPluginId: string,
  prevOptions: any
) => {
  if (prevPluginId === 'grafana-polystat-panel' && prevOptions.angular) {
    //@ts-ignore-next-line
    const angular = prevOptions.angular;
    //@ts-ignore-next-line
    const overrides = [];
    let options: PolystatOptions = panel.options;

    return options;
  }
  return {};
};
