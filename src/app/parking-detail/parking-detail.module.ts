import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ParkingDetailPageRoutingModule } from './parking-detail-routing.module';
import { ParkingDetailPage } from './parking-detail.page';
import { RemovewhitespacesPipe } from '../removewhitespaces.pipe'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParkingDetailPageRoutingModule
  ],
  declarations: [ParkingDetailPage, RemovewhitespacesPipe]
})
export class ParkingDetailPageModule {}
