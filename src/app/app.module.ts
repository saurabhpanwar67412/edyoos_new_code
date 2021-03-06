import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
// import { SharedModule } from './shared/shared.module';
import { MatFormFieldModule, MatFormFieldControl} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { ConfirmDialogModule } from './shared/confirm-dialog/confirm-dialog.module';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import {Stripe} from '@ionic-native/stripe/ngx';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RemovewhitespacesPipe } from './removewhitespaces.pipe';
// import { ApiService } from './api.service';
import { NotificationsComponent } from '../app/notifications/notifications.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [AppComponent, RemovewhitespacesPipe,NotificationsComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    CommonModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    //SharedModule,
    IonicStorageModule.forRoot(),
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ConfirmDialogModule,
    BrowserAnimationsModule,
    MatButtonModule, 

    MatCheckboxModule,
   
],
  providers: [
    StatusBar,
    SplashScreen,
    Stripe,
    // ApiService,
    Geolocation, NativeGeocoder, Camera, Base64, RemovewhitespacesPipe,
    StatusBar, SplashScreen, Stripe, Geolocation, NativeGeocoder, Camera, Base64, 
    RemovewhitespacesPipe, CookieService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
