import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NoizeeRoutingModule } from './noizee-routing.module';
import { MainComponent } from './main/main.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    NoizeeRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    CKEditorModule
  ]
})
export class NoizeeModule { }
