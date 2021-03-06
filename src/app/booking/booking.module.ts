import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingPageRoutingModule } from './booking-routing.module';

import { BookingPage } from './booking.page';
import {MatTabsModule} from '@angular/material/tabs';
// import {MatTabsModule} from '@angular/material/tabs';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BookingPageRoutingModule,
    MatTabsModule
  ],
  declarations: [BookingPage]
})
export class BookingPageModule {}
