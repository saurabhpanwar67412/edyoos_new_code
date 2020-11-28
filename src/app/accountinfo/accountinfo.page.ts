import { Component, OnInit,Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {SignupPageModule} from '../signup/signup.module';
import {LoginPageModule} from '../login/login.module';
import {PaymentinfoPage} from '../paymentinfo/paymentinfo.page';
import { AvailableSpotsRequest } from 'src/app/model/Booking/available_spots.model';
import * as moment from 'moment';
import { PlacesService } from 'src/app/shared/places.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { UserLogin } from 'src/app/model/login/login.model';
import { LoginService } from 'src/app/shared/authentication/login/login.service';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { User } from 'src/app/model/login/user.model';
import { Cart } from 'src/app/model/cart/cart.model';
import { CartService } from 'src/app/shared/cart.service';
import {CART_CHECKOUT_METADATA} from './account_metadata';



@Component({
  selector: 'app-accountinfo',
  templateUrl: './accountinfo.page.html',
  styleUrls: ['./accountinfo.page.scss'],
})
export class AccountinfoPage implements OnInit {
 
 
 usinglogin : any ;
 paymentForm: FormGroup;
 CART_CHECKOUT_METADATA = CART_CHECKOUT_METADATA;
 navdata : any ;


  constructor( private router: Router,
    private placesService: PlacesService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private loginService: LoginService,
    private cartService: CartService,) {
      this.route.queryParams.subscribe(params => {
        if (params && params.special) {
          this.usinglogin = JSON.parse(params.special);
          console.log("this.data from navigation AccountInfo",this.usinglogin);
        }
      });
     }

  ngOnInit(){
    this.paymentForm = this.fb.group({
    [CART_CHECKOUT_METADATA.phone]: ['', [Validators.pattern("^[1234567890][0-9]{9}$")]],
    [CART_CHECKOUT_METADATA.email]: ['', Validators.required],
    // [CART_CHECKOUT_METADATA.vehicleInfo]: this.formBuilder.group({
    //   [CART_CHECKOUT_METADATA.licenseNumber]: ['', [Validators.required, Validators.maxLength(50)]],
    //   [CART_CHECKOUT_METADATA.vehicleMake]: ['', [Validators.required, Validators.maxLength(100)]],
    //   [CART_CHECKOUT_METADATA.vehicleModel]: ['', [Validators.required, Validators.maxLength(50)]],
    //   [CART_CHECKOUT_METADATA.vehicleColor]: ['', Validators.required]
    // }),
    // [CART_CHECKOUT_METADATA.vehicleId]: ['', Validators.required]
  });
 
  }

  login(){
   let data : {
      'message' : "from accountinfo"
    }

    console.log("login up button clicked");
    let navigationExtras: any = {
      queryParams: {
        special: JSON.stringify(data)
      }
    };
    this.router.navigate(['login'],navigationExtras );
    
  }
  registerModal(){
    console.log("sign up button clicked");
    this.router.navigate(['signup'] );

  }
  paymentpage(){
debugger;
    this.router.navigate(['paymentinfo'] );
  
  }
  onSubmit(){
    let email = this.paymentForm.get(CART_CHECKOUT_METADATA.email).value;
    let phone = this.paymentForm.get(CART_CHECKOUT_METADATA.phone).value;
    console.log("email, phone", phone, email); 
    this.navdata = {
      'email' : email , 'phone' : phone};

    console.log("button clicked");
    let navigationExtras: any = {
      queryParams: {
        special: JSON.stringify(this.navdata)
      }
    };
    this.router.navigate(['paymentinfo'],navigationExtras );
    

  }

  /*Login with guest user and other login part*/

  nextStep() {
    

  }

  

}
