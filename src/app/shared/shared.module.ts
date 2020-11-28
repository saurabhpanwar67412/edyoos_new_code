import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NumbersOnlyDirective } from './numbers-only.directive';
// import { NavBarComponent } from '../nav-bar/nav-bar.component';
// import { FooterComponent } from '../footer/footer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterialModule } from './material.module';
// import { EmailUsComponent } from '../footer/email-us/email-us.component';
// import { NgbModule } from '';
// import { UserNavBarComponent } from '../user-nav-bar/user-nav-bar.component';
import { AvailableSpotsComponent } from '../available-spots/available-spots.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';
import { SignupPage } from '../signup/signup.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatToolbarModule,
    MatRadioModule,
    MatExpansionModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  entryComponents: [SignupPage],
  declarations: [SignupPage],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatToolbarModule,
    MatRadioModule,
    MatExpansionModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule
  ],
})
export class SharedModule { }
