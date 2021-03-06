import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgetPasswordPage } from './forget-password.page';
import { ResetpasswordPage } from '../resetpassword/resetpassword.page';

const routes: Routes = [
  {
    path: '',
    component: ForgetPasswordPage
  },
  {
    path: 'resetpassword',
    component: ResetpasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgetPasswordPageRoutingModule {}
