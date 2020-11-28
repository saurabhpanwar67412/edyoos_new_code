import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MybagPage } from './mybag.page';

const routes: Routes = [
  {
    path: '',
    component: MybagPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MybagPageRoutingModule {}
