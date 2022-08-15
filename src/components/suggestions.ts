import { VisualizationSuggestionsBuilder } from '@grafana/data';
import { PolystatOptions } from './types';

export class PolystatDataSuggestionsSupplier {
  getSuggestionsForData(builder: VisualizationSuggestionsBuilder) {
    const list = builder.getListAppender<PolystatOptions, {}>({
      name: 'Polystat',
      pluginId: 'grafana-polystat-panel',
      options: {},
    });

    const { dataSummary } = builder;

    if (!dataSummary.hasNumberField) {
      return;
    }

    list.append({
      name: 'polystat',
    });
  }
}
