import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailconfirmationPageRoutingModule } from './emailconfirmation-routing.module';

import { EmailconfirmationPage } from './emailconfirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EmailconfirmationPageRoutingModule
  ],
  declarations: [EmailconfirmationPage]
})
export class EmailconfirmationPageModule {}
