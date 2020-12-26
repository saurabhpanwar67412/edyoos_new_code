import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingDetailsPageRoutingModule } from './booking-details-routing.module';

import { BookingDetailsPage } from './booking-details.page';
import { RemovewhitespacesPipe } from '../removewhitespaces.pipe'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingDetailsPageRoutingModule
  ],
  declarations: [BookingDetailsPage, RemovewhitespacesPipe]
})
export class BookingDetailsPageModule {}
