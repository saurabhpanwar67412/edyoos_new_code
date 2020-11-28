import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeDateModalPageRoutingModule } from './change-date-modal-routing.module';

import { ChangeDateModalPage } from './change-date-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeDateModalPageRoutingModule
  ],
  declarations: [ChangeDateModalPage]
})
export class ChangeDateModalPageModule {}
