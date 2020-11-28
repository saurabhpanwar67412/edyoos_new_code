import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentsuccessPage } from './paymentsuccess.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentsuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsuccessPageRoutingModule {}
