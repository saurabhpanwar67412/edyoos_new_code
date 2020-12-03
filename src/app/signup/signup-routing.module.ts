import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupPage } from './signup.page';
import { EmailconfirmationPage } from '../emailconfirmation/emailconfirmation.page';

const routes: Routes = [
  {
    path: '',
    component: SignupPage
  },
  {
    path: 'emailconfirmation',
    component: EmailconfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPageRoutingModule {}
