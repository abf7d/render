import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VivViewComponent } from './viv-view/viv-view.component';
import { MenuComponentsModule } from '@render/menu-components';

@NgModule({
  imports: [CommonModule, MenuComponentsModule],
  declarations: [
    VivViewComponent
  ],
  exports: [
    VivViewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewsModule {}
