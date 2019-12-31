import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoizeeRoutingModule } from './noizee-routing.module';
import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    NoizeeRoutingModule
  ]
})
export class NoizeeModule { }
