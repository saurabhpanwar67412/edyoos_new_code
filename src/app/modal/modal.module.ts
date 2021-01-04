import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ModalPageRoutingModule } from './modal-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalPage } from './modal.page';
import { GoogleMap } from '@angular/google-maps';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ModalPage],
  providers:[GoogleMap]
})
export class ModalPageModule {}
