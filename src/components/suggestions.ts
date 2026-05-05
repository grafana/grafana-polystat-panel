import { FieldType, VisualizationSuggestionScore } from '@grafana/data';

export const polystatSuggestionsSupplier = (dataSummary: any) => {
  if (!dataSummary.hasData) {
    return;
  }
  if (!dataSummary.hasFieldType(FieldType.number)) {
    return;
  }
  return [
    {
      name: 'Polystat',
      pluginId: 'grafana-polystat-panel',
      score: VisualizationSuggestionScore.OK,
    },
  ];
};
