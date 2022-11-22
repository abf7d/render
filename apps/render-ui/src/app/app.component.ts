import { Component } from '@angular/core';
import { store } from 'libs/state/state';
import config from '../assets/config.json';
import { processOverlayData } from '../../../../libs/data-processing/process-overlay-data';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'render-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  heatmapIds: { label: string; value: string }[] | undefined;
  imageUrls: string[] | undefined;
  overlayData: any;

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    const numberOfPlates = 50;
    const imageUrl$ = this.http.get(config.plateUrl);
    const overlayUrl$ = this.http.get(config.overlayUrl);
    forkJoin([imageUrl$, overlayUrl$]).subscribe(
      ([imageData, overlayData]: [any, any]) => {
        this.imageUrls = imageData
          .map((item: { name: string }) => config.plateUrl + item.name)
          .slice(0, numberOfPlates);
        const processedData = processOverlayData({
          overlayData: overlayData.slice(0, numberOfPlates),
          baseChemicalUrl: config.baseFormulaUrl,
          cellSize: 3263,
          plateSpacingX: 100000,
          plateSpacingY: 100000,
          platesPerRow: 20,
          wellsPerRow: 24,
          wellsPerColumn: 16,
        });
        this.overlayData = processedData;
        this.heatmapIds = overlayData[0].gridCellLayers
          .map((d: any) => ({ label: d.id, value: d.id }))
          .concat({ label: 'None', value: null });
      }
    );
  }
}
