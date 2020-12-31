import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ParkingDetailPageRoutingModule } from './parking-detail-routing.module';
import { ParkingDetailPage } from './parking-detail.page';
import { RemovewhitespacesPipe } from '../removewhitespaces.pipe'
//import { DpDatePickerModule } from 'ng2-date-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParkingDetailPageRoutingModule,
   // DpDatePickerModule,
  ],
  declarations: [ParkingDetailPage, RemovewhitespacesPipe]
})
export class ParkingDetailPageModule {}
