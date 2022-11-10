// @ts-ignore

import {PolygonLayer} from '@deck.gl/layers';

export const generatePolygons = (data: any, visible: boolean, opacity: number) => {
  
  return new PolygonLayer({
    id: 'polygon-layer-#detail#',
    data,
    visible,
    opacity,
    pickable: true,
    autoHighlight: true,
    highlightColor: [255, 255, 255, 80],
    lineWidthMinPixels: 3,
    getPolygon: (d: any) => d.contour,
    getFillColor: (d: any) => d.fillColor,
    getLineColor: (d: any) => d.lineColor
  });
};
