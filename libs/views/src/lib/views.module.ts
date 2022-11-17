import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VivViewComponent } from './viv-view/viv-view.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    VivViewComponent
  ],
  exports: [
    VivViewComponent
  ],
})
export class ViewsModule {}
