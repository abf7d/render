import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayMenuComponent } from './overlay-menu/OverlayMenu.component';
import { ImageMenuComponent } from './image-menu/image-menu.component';

@NgModule({
  imports: [CommonModule],
  declarations: [OverlayMenuComponent, ImageMenuComponent],
  exports: [OverlayMenuComponent, ImageMenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiModule {}
