import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentinfoPage } from './paymentinfo.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentinfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentinfoPageRoutingModule {}
