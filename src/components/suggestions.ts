import { FieldType, PanelDataSummary, VisualizationSuggestionScore } from '@grafana/data';

export const polystatSuggestionsSupplier = (dataSummary: PanelDataSummary) => {
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
