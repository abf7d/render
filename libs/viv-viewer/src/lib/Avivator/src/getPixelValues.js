export const getPixelValues = (info) => {
  if (info === undefined) return ['---', '---', '---'];
  const { tile, coordinate, sourceLayer: layer } = info;
  let hoverData;
  if (!layer) return ['---', '---', '---'];
  if (layer.id.includes('Tiled')) {
    if (!tile?.content) {
      return ['---', '---', '---'];
    }
    const { content, bbox, z } = tile;
    if (!content.data || !bbox) {
      return ['---', '---', '---'];
    }
    const { data, width, height } = content;
    const { left, right, top, bottom } = bbox;
    const bounds = [
      left,
      data.height < layer.tileSize ? height : bottom,
      data.width < layer.tileSize ? width : right,
      top,
    ];
    if (!data) {
      return ['---', '---', '---'];
    }
    const layerZoomScale = Math.max(1, 2 ** Math.round(-z));
    const dataCoords = [
      Math.floor((coordinate[0] - bounds[0]) / layerZoomScale),
      Math.floor((coordinate[1] - bounds[3]) / layerZoomScale),
    ];
    const coords = dataCoords[1] * width + dataCoords[0];
    hoverData = data.map((d) => d[coords]);
  } else {
    const { channelData } = layer.props;
    if (!channelData) {
      return ['---', '---', '---'];
    }
    const { data, width, height } = channelData;
    if (!data || !width || !height) {
      return ['---', '---', '---'];
    }
    const bounds = [0, height, width, 0];
    const { zoom } = layer.context.viewport;
    const layerZoomScale = Math.max(1, 2 ** Math.floor(-zoom));
    const dataCoords = [
      Math.floor((coordinate[0] - bounds[0]) / layerZoomScale),
      Math.floor((coordinate[1] - bounds[3]) / layerZoomScale),
    ];
    const coords = dataCoords[1] * width + dataCoords[0];
    hoverData = data.map((d) => d[coords]);
  }
  return hoverData;
};
