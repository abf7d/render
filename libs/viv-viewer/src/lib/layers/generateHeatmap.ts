import { GridCellLayer } from 'deck.gl';

export const generateHeatmap = (
  data: unknown,
  cellSize: number,
  visible: boolean,
  zoomOpacity: number,
  sliderOpacity: number,
  selectedHeatmap: string
) => {
  return new GridCellLayer({
    id: 'grid-cell-layer-#detail#',
    data,
    // This layer does not explicitly specify its `visible` property, it uses the opacity property for showing and hiding the layer
    pickable: true,
    autoHighlight: zoomOpacity > 0.5,
    highlightColor: [255, 255, 255, 80],
    extruded: false,
    cellSize,
    opacity:
      selectedHeatmap === null || !visible ? 0 : zoomOpacity * sliderOpacity,
    getPosition: (d: any) => d.position,
    getFillColor:
      selectedHeatmap === null
        ? [0, 0, 0, 0]
        : (d: any) => d.fillColors[selectedHeatmap],
    updateTriggers: {
      getFillColor: selectedHeatmap,
    },
  });
};
