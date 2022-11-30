/* eslint-disable */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VivViewComponent } from './viv-view/viv-view.component';
import { MenuComponentsModule } from '@labshare/menu-components';
// noinspection ES6UnusedImports
import '@labshare/viv-viewer';

@NgModule({
  imports: [CommonModule, MenuComponentsModule],
  declarations: [VivViewComponent],
  exports: [VivViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewsModule {}
