import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailconfirmationPage } from './emailconfirmation.page';

const routes: Routes = [
  {
    path: '',
    component: EmailconfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailconfirmationPageRoutingModule {}
