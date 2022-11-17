import { Component, OnInit, Input, ViewChild } from '@angular/core';
import "./OverlayMenuWebComponent";

@Component({
  selector: 'render-overlay-menu',
  templateUrl: './overlay-menu.component.html',
  styleUrls: ['./overlay-menu.component.css'],
})
export class OverlayMenuComponent implements OnInit {
  @Input() heatmapIds: any = [];


  /*private */count: number = 0;
  @ViewChild("overlayMenuVIewChild") overlayMenuVIewChild: any;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: any) {
    console.log(changes, 'changes',this.overlayMenuVIewChild.nativeElement)
    this.overlayMenuVIewChild.nativeElement.data=changes.heatmapIds.currentValue;
  }
}