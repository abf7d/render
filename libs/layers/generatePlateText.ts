// @ts-ignore
import {TextLayer} from '@deck.gl/layers';

export const generatePlateText = (data: unknown, visible: boolean) => {
  return new TextLayer({
    id: 'text-layer-#detail#-plateText',
    data,
    visible,
    getColor: [255, 255, 255],
    getPosition: (d: any) => [(d.contour[0][0] + d.contour[2][0]) / 2, (d.contour[0][1] + d.contour[2][1]) / 2],
    getText: (d: any) => d.plateText,
    getSize: 18
  });
};
