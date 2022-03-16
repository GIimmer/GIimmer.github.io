import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PopoutWindowModule } from '../../projects/popout-window/src/lib/popout-window.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    PopoutWindowModule,
    DragDropModule,
    MatIconModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
