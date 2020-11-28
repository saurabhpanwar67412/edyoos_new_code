import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MybagPageRoutingModule } from './mybag-routing.module';

import { MybagPage } from './mybag.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MybagPageRoutingModule
  ],
  declarations: [MybagPage]
})
export class MybagPageModule {}
