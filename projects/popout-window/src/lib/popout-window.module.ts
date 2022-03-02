import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PopoutWindowComponent } from './popout-window.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PopoutWindowComponent],
  exports: [PopoutWindowComponent]
})
export class PopoutWindowModule { }
