// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconLayer } from 'deck.gl';
import { iconOffsetX, iconOffsetY } from './constants';

export const generateIcons = (
  data: unknown[],
  cellSize: number,
  visible: boolean
) => {
  return new IconLayer({
    id: 'icon-layer-#detail#',
    data,
    visible,
    sizeScale: 1200,
    getColor: [255, 255, 255],
    sizeUnits: 'meters',
    getIcon: (d: any) => ({
      url: d.drugUrl,
      mask: true,
      width: 400,
      height: 400,
    }),
    getPosition: (d: any) => [
      d.position[0] + iconOffsetX,
      d.position[1] + iconOffsetY,
    ],
  });
};
