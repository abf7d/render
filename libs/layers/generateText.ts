import {TextLayer} from 'deck.gl';

export const generateText = (data: unknown, cellSize: number, visible: boolean, entry: string) => {
  return new TextLayer({
    id: 'text-layer-#detail#-' + entry,
    data,
    visible,
    getColor: [255, 255, 255],
    getPosition: (d: any) => d.position.map((coordinate: any) => coordinate + cellSize / 2),
    getText: (d: any) => d[entry],
    getSize: 11
  });
};
