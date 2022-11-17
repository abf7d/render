import { Component } from '@angular/core';
import { store } from 'libs/state/state';
import config from '../assets/config.json';
import { processOverlayData } from '../../../../libs/data-processing/process-overlay-data';
interface Todo {
  title: string;
}

@Component({
  selector: 'render-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  heatmapIds: {label: string, value: string}[] | undefined;
  imageUrls: string[] | undefined;
  overlayData: any;

  ngOnInit(): void {
    const numberOfPlates = 50;
    fetch(config.plateUrl)
      .then((response) => response.json())
      .then((data) => {
        this.imageUrls = data
          .map((item: { name: string }) => config.plateUrl + item.name)
          .slice(0, numberOfPlates);
      });
    fetch(config.overlayUrl)
      .then((response) => response.json())
      .then((data) => {
        const processedData = processOverlayData({
          overlayData: data.slice(0, numberOfPlates),
          baseChemicalUrl: config.baseFormulaUrl,
          cellSize: 3263,
          plateSpacingX: 100000,
          plateSpacingY: 100000,
          platesPerRow: 20,
          wellsPerRow: 24,
          wellsPerColumn: 16,
        });
        this.overlayData=processedData;
        this.heatmapIds = data[0].gridCellLayers
          .map((d: any) => ({ label: d.id, value: d.id }))
          .concat({ label: 'None', value: null });
      });
  }
}
