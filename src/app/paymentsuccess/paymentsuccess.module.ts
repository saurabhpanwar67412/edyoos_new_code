import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentsuccessPageRoutingModule } from './paymentsuccess-routing.module';

import { PaymentsuccessPage } from './paymentsuccess.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentsuccessPageRoutingModule
  ],
  declarations: [PaymentsuccessPage]
})
export class PaymentsuccessPageModule {}
