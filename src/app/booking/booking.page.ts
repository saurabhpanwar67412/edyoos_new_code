import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController,LoadingController,ModalController } from '@ionic/angular';
import {AccountinfoPage} from '../accountinfo/accountinfo.page';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/shared/authentication/login/login.service';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import * as moment from 'moment';
import { CartService } from 'src/app/shared/cart.service';
import { PlacesService } from 'src/app/shared/places.service';
import { Cart } from 'src/app/model/cart/cart.model';
import { AvailableSpotsRequest } from 'src/app/model/Booking/available_spots.model';
import {ChangeDateModalPage} from '../change-date-modal/change-date-modal.page';
import { NotificationsComponent } from '../notifications/notifications.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  data: any;
  changeddate: Date;
  someVar;
  bookedPlaces: any[];
  reserveNow: boolean = false;
  public spotDetails: AvailableSpotsRequest;
  total = 0;
  httpError: any;

  constructor(private route: ActivatedRoute, private router: Router,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private loginService: LoginService, private authenticationService: AuthenticationService,
    private cartService: CartService,
    private placesService: PlacesService,public modalController: ModalController,
    public popoverController: PopoverController) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
        console.log("this.data from navigation",this.data);
      }
    });
  }
   
  

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: NotificationsComponent,
      showBackdrop  : false , 
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  ngOnInit() {
     this.bookedPlaces = this.placesService.cartPropertyGroup;
    this.bookedPlaces.forEach((o) => {
      // o.checkoutAmount=o.calculatedAmount;
      o.changeDateClick = false;
      o.isDateRangeValid = true;
      o.changeSearchFromDateTime = moment(o.searchFromDateTime);
      o.changesearchToDateTime = moment(o.searchToDateTime);

      o.searchFromDateTime = moment(o.searchFromDateTime);
      o.searchToDateTime = moment(o.searchToDateTime);
      o.isSpotAvaliable = true;

    });

    this.calculateTotal();
    // this.createForm();
    this.route.paramMap.subscribe((params) => {

      if (params.get('reservenow')) {
        this.reserveNow = true;
      }
      if (params.get('spot')) {
        const spot = params.get('spot') ? JSON.parse(params.get('spot').toString().toLowerCase()) :
          new AvailableSpotsRequest();
        this.spotDetails = new AvailableSpotsRequest();
        this.spotDetails.FromDate = new Date(spot.fromdate);
        this.spotDetails.ToDate = new Date(spot.todate);
        this.reserveNow = true;

      }
    });

  }

  calculateTotal() {
    this.total = 0;
    this.bookedPlaces.forEach((place) => {

    });

  }

  goBack(){
    console.log("go back calling")
    this.navCtrl.back();
  }

  confirmtoaccount(){
    
    console.log("this data from booking", this.data);
    let userdetails = JSON.parse(localStorage.getItem('edyoosUserDetails'));
    console.log("user is loggedin alread", userdetails);
   if(userdetails){
    console.log("user is loggedin alread", userdetails);
    let navigationExtras: any = {
      queryParams: {
        special: JSON.stringify(userdetails)
      }
    };
    
    this.router.navigate(['paymentinfo'],navigationExtras );

   }
   else{
    let navigationExtras: any = {
      queryParams: {
        special: JSON.stringify(this.data)
      }
    };
    this.router.navigate(['accountinfo'],navigationExtras );

   }
    
   
  }

  filter(){
    this.someVar = new Date().toISOString();
    console.log("selected date printed",  this.changeddate)
    }

    async changeDateClick(data) {
      console.log("place",data);
       
      console.log("parkingDetail clicked or choosed.")
       var modalPage = await this.modalController.create(
         {
           component:ChangeDateModalPage,
           componentProps: {
            'message': this.data,  
          }
         }
       ); 
       return await modalPage.present();

      // place.changeDateClick = true;
  
    }

   
    openPrivacyNewWindow() {
      debugger;
      window.open('privacy',
        '_blank',
        'width=500,height=500,top=' + 0 + ', left=' + 0);
    }
    openTermsNewWindow() {
      debugger;
      window.open('terms-and-conditions',
        '_blank',
        'width=500,height=500,top=' + 0 + ', left=' + 0);
    }

   
    home(){
      this.router.navigate(['/']);
    }

    
    
}
