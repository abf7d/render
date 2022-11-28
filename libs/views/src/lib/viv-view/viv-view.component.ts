import { Component, Input, OnInit } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { store } from 'libs/state/state';

@Component({
  selector: 'render-viv-view',
  templateUrl: './viv-view.component.html',
  styleUrls: ['./viv-view.component.scss'],
})
export class VivViewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() set heatmapIds(
    value: { label: string; value: string }[] | undefined
  ) {
    value !== undefined &&
      store.setState({
        heatmapIds: value as any,
      });
  }

  @Input() set imageUrls(value: string[] | undefined) {
    value !== undefined &&
      store.setState({
        urls: value as any,
      });
  }

  @Input() set overlayData(value: any) {
    value !== undefined &&
      store.setState({
        processedData: value,
      });
  }
}
