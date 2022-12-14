import create from 'zustand/vanilla';

export const store = create(() => ({
  heatmapId: '',
  heatmapIds: [],
  urls: [],
  processedData: {},
  overlayVisibilities: {
    'All Overlays': true,
    'Well Heatmap': true,
    'Plate Heatmap': true,
    Text: true,
    'Well Heatmap When Zoomed Out': false,
    Tooltip: true,
  },
  heatmapOpacity: 0.3,
  onSelectionChanges: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleChannelAdd: () => {},
}));