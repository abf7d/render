import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenderVivViewComponent } from './render-viv-view/render-viv-view.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    RenderVivViewComponent
  ],
  exports: [
    RenderVivViewComponent
  ],
})
export class ViewsModule {}
