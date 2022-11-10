import { Component, OnInit, Input, ViewChild } from '@angular/core';
import "./OverlayMenuWebComponent";

@Component({
  selector: 'myorg-OverlayMenu',
  templateUrl: './OverlayMenu.component.html',
  styleUrls: ['./OverlayMenu.component.css'],
})
export class OverlayMenuComponent implements OnInit {
  @Input() heatmapIds: any = [];


  /*private */count: number = 0;
  @ViewChild("overlayMenuVIewChild") overlayMenuVIewChild: any;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: any) {
    console.log(changes, 'changes')
    this.overlayMenuVIewChild.nativeElement.data=changes.heatmapIds.currentValue;
  }
}