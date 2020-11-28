import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ForgetPasswordPageRoutingModule } from './forget-password-routing.module';
import {FormsModule , ReactiveFormsModule} from '@angular/forms';
import { ForgetPasswordPage } from './forget-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgetPasswordPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ForgetPasswordPage]
})

export class ForgetPasswordPageModule {}
