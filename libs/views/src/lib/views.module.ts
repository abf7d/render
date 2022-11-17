import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VivViewComponent } from './viv-view/viv-view.component';
import { UiModule } from '@render/ui';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [
    VivViewComponent
  ],
  exports: [
    VivViewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewsModule {}
