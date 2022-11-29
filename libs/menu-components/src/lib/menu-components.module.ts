import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageMenuComponent } from './image-menu/image-menu.component';
import { OverlayMenuComponent } from './overlay-menu/overlay-menu.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ImageMenuComponent, OverlayMenuComponent],
  exports: [ImageMenuComponent, OverlayMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MenuComponentsModule {}
