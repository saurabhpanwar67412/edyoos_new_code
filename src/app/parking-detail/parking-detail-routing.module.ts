import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParkingDetailPage } from './parking-detail.page';
import { RemovewhitespacesPipe } from '../removewhitespaces.pipe';

const routes: Routes = [
  {
    path: '',
    component: ParkingDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParkingDetailPageRoutingModule {}
