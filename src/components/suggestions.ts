import { VisualizationSuggestionsBuilder } from '@grafana/data';
import { PolystatOptions } from './types';

export class PolystatDataSuggestionsSupplier {
  getSuggestionsForData(builder: VisualizationSuggestionsBuilder) {
    const { dataSummary: ds } = builder;

    if (!ds.hasData) {
      return;
    }
    if (!ds.hasNumberField) {
      return;
    }

    const list = builder.getListAppender<PolystatOptions, {}>({
      name: 'Polystat',
      pluginId: 'grafana-polystat-panel',
      options: {},
    });

    list.append({
      name: 'Polystat',
    });
  }
}
