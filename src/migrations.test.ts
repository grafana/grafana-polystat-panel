import { PanelModel } from '@grafana/data';

import { PolystatPanelChangedHandler } from './migrations';

describe('Polystat -> PolystatV2 migrations', () => {
  it('only migrates old polystat', () => {
    const panel = {} as PanelModel;

    const options = PolystatPanelChangedHandler(panel, 'some-panel-id', {});
    expect(options).toEqual({});
  });
});
