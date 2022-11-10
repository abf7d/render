export const processOverlayData:
(arg: {overlayData: any[], baseChemicalUrl: string, cellSize:number, plateSpacingX:number, plateSpacingY: number, platesPerRow: number, wellsPerRow: number, wellsPerColumn: number})=>any 

= ({overlayData, baseChemicalUrl, cellSize, plateSpacingX, plateSpacingY, platesPerRow, wellsPerRow, wellsPerColumn}) => {
    const plateOverlayData: any[] = [];
    const wellOverlayData: any = [];

    const numberOfPlates = overlayData.length;
    for (let i = 0; i < numberOfPlates; i++) {
        const x = (i % platesPerRow) * plateSpacingX;
        const y = plateSpacingY * Math.floor(i / platesPerRow);
        const value = Math.floor(Math.random() * 256);

        const numberOfWells = overlayData[0].gridCellLayers[0].data.length;
        for (let j = 0; j < numberOfWells; j++) {
            wellOverlayData[i * numberOfWells + j] = {};
            wellOverlayData[i * numberOfWells + j].position = [
            x + overlayData[i].gridCellLayers[0].data[j].position[0],
            y + overlayData[i].gridCellLayers[0].data[j].position[1]
            ];
            wellOverlayData[i * numberOfWells + j].drugUrl =
            overlayData[i].chemLayers[0].data[j].smile === ''
                ? undefined
                : baseChemicalUrl +
                encodeURIComponent(overlayData[i].chemLayers[0].data[j].smile);
            wellOverlayData[i * numberOfWells + j].well_location =
            overlayData[i].textLayers[0].data[j]?.text;
            const drugNameData = overlayData[i].textLayers[2].data[j]?.text;
            wellOverlayData[i * numberOfWells + j].drug_name = drugNameData === '' ? 'Drug name unavailable' : drugNameData;
            wellOverlayData[i * numberOfWells + j].viral_data =
            overlayData[i].textLayers[1].data[j]?.text;
            wellOverlayData[i * numberOfWells + j].fillColors = overlayData[
            i
            ].gridCellLayers.reduce((acc: any, entry: any) => ({...acc, [entry.id]: entry.data[j].fillColor}), {} /*, {
            undefined: [0, 0, 0, 1]
            }*/);
        }
        plateOverlayData.push({
            plateNumber: i,
            contour: [
            [x, y],
            [x + cellSize * wellsPerRow, y],
            [x + cellSize * wellsPerRow, y + cellSize * wellsPerColumn],
            [x, y + cellSize * wellsPerColumn]
            ],
            fillColor: [value, 0, 0, value],
            lineColor: [value, 0, 0],
            plateText: '' + i
        });
    }
    return {plateOverlayData, wellOverlayData, cellSize};
}