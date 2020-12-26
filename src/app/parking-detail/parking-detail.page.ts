import { Component, OnInit,AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from 'src/app/shared/places.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SEARCH_FORM_METADATA, SortMethodEnum,Mode } from './parking.metadata';
import { SearchRequest } from 'src/app/model/search/search_request.model';
import * as moment from 'moment';
import { NavController,LoadingController,ModalController  } from '@ionic/angular';
import {BookingPageModule} from '../booking/booking.module';
import {ModalPagePage} from "../modal-page/modal-page.page";
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import sort from 'fast-sort';
import { ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

import { AvailableSpotsRequest } from 'src/app/model/Booking/available_spots.model';
declare var jQuery:any;
@Component({
  selector: 'app-parking-detail',
  templateUrl: './parking-detail.page.html',
  styleUrls: ['./parking-detail.page.scss'],
})
export class ParkingDetailPage implements OnInit,AfterViewInit {
  public changeDate = false;
  currentLocation;
  httpError: any;
  dateForm: FormGroup;
  SEARCH_FORM_METADATA = SEARCH_FORM_METADATA;
  searchAddress: any = {};
  now;
  showMessage:boolean;
  message:any;
  dataLength:any;
  parkingDetailsList:any[];
  loading: any;
  searchobject = new SearchRequest();
  navdata : any ;
  displayedPlaces: any[] = [];
  selectedMode;
  sortMethod;
  SortMethodEnum = SortMethodEnum;
  reserveNow: boolean = false;
  public spotDetails: AvailableSpotsRequest;
  selectedTabIndex: number=1;
  public fromDate;
  public toDate;  
  hideMe ; 
  Isshowing : boolean=false;
  imageurl: string;
  item:any=[];

  constructor( private route: ActivatedRoute,
    private placesService: PlacesService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private storage: Storage,
    private modalCtrl: ModalController) {
      this.createForms();
     
  }

  async ngAfterViewInit() {
   
    // throw new Error('Method not implemented.');
  }

  onChangeDateClick() {
    console.log("i am called insidte ")
    this.changeDate = true;
  }

  onChangeDateClickCancel() {
    this.changeDate = false;
  }

  public changeDateCancelClick(parkingDetail) {
    parkingDetail.changeDateClick = false;
    parkingDetail.changeSearchFromDateTime = parkingDetail.searchFromDateTime;
    parkingDetail.changesearchToDateTime = parkingDetail.searchToDateTime;
  }
  fromDateChange(parkingDetail) {
    let date = parkingDetail.changeSearchFromDateTime;
    let toDate = parkingDetail.changesearchToDateTime;
    if (
      date &&
      toDate &&
      moment(date).isSameOrAfter(toDate)
    ) {

      parkingDetail.isDateRangeValid = false;
    }
    else {
      parkingDetail.isDateRangeValid = true;
    }

  }
  toDateChange(parkingDetail) {
    let date = parkingDetail.changesearchToDateTime;
    let fromDate = parkingDetail.changeSearchFromDateTime;
    if (
      date &&
      fromDate &&
      moment(date).isSameOrBefore(fromDate)
    ) {
      parkingDetail.isDateRangeValid = false;

    }
    else {
      parkingDetail.isDateRangeValid = true;
    }

  }
  public changeDateApply(parkingDetail, index) {
    parkingDetail.searchFromDateTime = moment(parkingDetail.changeSearchFromDateTime);
    parkingDetail.searchToDateTime = moment(parkingDetail.changesearchToDateTime);

    let fromDate = new Date(parkingDetail.searchFromDateTime);
    let toDate = new Date(parkingDetail.searchToDateTime);

    if (!moment(parkingDetail.searchFromDateTime).isSameOrBefore(new Date())) {
      parkingDetail.showDateError = false;
    }

    let availableSpotsRequest = new AvailableSpotsRequest();
    availableSpotsRequest.PropertyGroupID = parkingDetail.propertyGroupID;
    availableSpotsRequest.FromDate = fromDate;
    availableSpotsRequest.ToDate = toDate;
    availableSpotsRequest.FromTime = moment(fromDate).format("hh:mm:ss A");
    availableSpotsRequest.ToTime = moment(toDate).format("hh:mm:ss A");
    availableSpotsRequest.PropertyGroupAmount = parkingDetail.pricingAmount;
    availableSpotsRequest.PriceCode = parkingDetail.pricingCode;

    this.placesService.SpotAvalibilityCheckonCheckOut(availableSpotsRequest)
      .subscribe((response) => {
        parkingDetail.changeDateClick=false;
        this.parkingDetailsList[index].isSpotAvaliable = response.data.isSpotAvaliable;
        this.parkingDetailsList[index].calculatedAmount = response.data.propertyGroupAmount;

        if (this.parkingDetailsList[index].discountedPrice) {
          let discount =
            this.parkingDetailsList[index].calculatedAmount * (this.parkingDetailsList[index].discountedPrice / 100);
          this.parkingDetailsList[index].checkoutAmount = this.parkingDetailsList[index].calculatedAmount - discount;
        }
        else {
          this.parkingDetailsList[index].checkoutAmount = this.parkingDetailsList[index].calculatedAmount;
        }

        this.placesService.cartPropertyGroup = this.parkingDetailsList;
        this.placesService.addedCartPropertyGroup.next(this.parkingDetailsList);
        this.changeDateCancelClick(parkingDetail);
      }, (error) => {
        this.httpError = error;
      });
  }
  
  calculateTotal() {
    this.total = 0;
    this.parkingDetailsList.forEach((place) => {
    });

  }
  init() {
    if (isNaN(this.selectedTabIndex) || this.selectedTabIndex < 0) {
       this.selectedTabIndex = 0;
     }
       this.parkingDetailsList = this.placesService.cartPropertyGroup;
       this.placesService.addedCartPropertyGroup.subscribe((value: any[]) => {
               this.parkingDetailsList = value;
               this.calculateTotal();
             });
       this.parkingDetailsList.forEach((o) => {
         // o.checkoutAmount=o.calculatedAmount;
         o.changeDateClick = false;
         o.isDateRangeValid = true;
         o.changeSearchFromDateTime = moment(o.searchFromDateTime);
         o.changesearchToDateTime = moment(o.searchToDateTime);
   
         o.searchFromDateTime = moment(o.searchFromDateTime);
         o.searchToDateTime = moment(o.searchToDateTime);
         // o.isSpotAvaliable = true;
         jQuery('#datetimepicker').datetimepicker({
           onChangeDateTime:function( ct ){
            debugger;
            jQuery('#todatetimepicker').datetimepicker({minDate:ct,format:'Y-m-d g:i A'});
            jQuery('#datetimepicker').datetimepicker('hide');
            jQuery('#todatetimepicker').datetimepicker('show');
            },  
            format:'Y-m-d g:i A',
            minDate:new Date() ,
            allowTimes:[
             '00:00','00:15', '00:30', '00:45','01:00', 
             '01:15', '01:30', '01:45','02:00', 
             '02:15', '02:30', '02:45','03:00', 
             '03:15', '03:30', '03:45','04:00',
             '04:15', '04:30', '04:45','05:00', 
             '05:15', '05:30', '05:45','06:00',
             '06:15', '06:30', '06:45','07:00', 
             '07:15', '07:30', '07:45','08:00',
             '08:15', '08:30', '08:45','09:00', 
             '09:15', '09:30', '09:45','00:00',
             '10:15', '10:30', '10:45','11:00', 
             '11:15', '11:30', '11:45','12:00',
             '12:15', '12:30', '12:45','13:00', 
             '13:15', '13:30', '13:45','14:00',
             '14:15', '14:30', '14:45','15:00', 
             '15:15', '15:30', '15:45','16:00',
             '16:15', '16:30', '16:45','17:00', 
             '17:15', '17:30', '17:45','18:00',
             '18:15', '18:30', '18:45','19:00', 
             '19:15', '19:30', '19:45','20:00',
             '20:15', '20:30', '20:45','21:00', 
             '21:15', '21:30', '21:45','22:00',
             '22:15', '22:30', '22:45','23:00', 
             '23:15', '23:30', '23:45'
            ] 
       });
         jQuery('#todatetimepicker').datetimepicker({minDate:new Date(),
           format:'Y-m-d g:i A',
           onChangeDateTime:function( ct ){
           jQuery('#todatetimepicker').datetimepicker('hide');
           },
           allowTimes:[
             '00:00','00:15', '00:30', '00:45','01:00', 
             '01:15', '01:30', '01:45','02:00', 
             '02:15', '02:30', '02:45','03:00', 
             '03:15', '03:30', '03:45','04:00',
             '04:15', '04:30', '04:45','05:00', 
             '05:15', '05:30', '05:45','06:00',
             '06:15', '06:30', '06:45','07:00', 
             '07:15', '07:30', '07:45','08:00',
             '08:15', '08:30', '08:45','09:00', 
             '09:15', '09:30', '09:45','00:00',
             '10:15', '10:30', '10:45','11:00', 
             '11:15', '11:30', '11:45','12:00',
             '12:15', '12:30', '12:45','13:00', 
             '13:15', '13:30', '13:45','14:00',
             '14:15', '14:30', '14:45','15:00', 
             '15:15', '15:30', '15:45','16:00',
             '16:15', '16:30', '16:45','17:00', 
             '17:15', '17:30', '17:45','18:00',
             '18:15', '18:30', '18:45','19:00', 
             '19:15', '19:30', '19:45','20:00',
             '20:15', '20:30', '20:45','21:00', 
             '21:15', '21:30', '21:45','22:00',
             '22:15', '22:30', '22:45','23:00', 
             '23:15', '23:30', '23:45'
            ] 
         });
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
   
      
       this.fromDate = moment(this.spotDetails?.FromDate);
       this.toDate = moment(this.spotDetails?.ToDate);
       
     }
     total = 0;

  async ngOnInit() {
    this.imageurl = environment.blobURL + '/images/Amenieties' ;
    console.log("this.imageurlthis.imageurl:::::", this.imageurl);
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await this.loading.present();
    this.getDataFromQueryParams();
  }

  getDataFromQueryParams() {

    this.route.paramMap.subscribe((params) => {
      if (params.get('lat') && params.get('lng')) {
        this.currentLocation = {
          lat: parseFloat(params.get('lat')),
          lng: parseFloat(params.get('lng')),
        };
      }

      if (params.get('mode')){
        this.selectedMode = params.get('mode');
      }

      let searchAddress: string;

      if (params.get('street')) {
        this.searchAddress.street_number = params.get('street');
        // searchAddress = params.get('street');
      }
      if (params.get('locality')) {
        this.searchAddress.locality = params.get('locality');
        // searchAddress = searchAddress ? searchAddress + ',' + params.get('locality') : params.get('locality');
      }
      this.search();
    })
  }

  async search() {
    console.log("search calling");
    if (this.currentLocation.lng && this.currentLocation.lat) {
      this.httpError = null;
      let fromDate = this.dateForm.get(SEARCH_FORM_METADATA.fromDate).value;
      let toDate = this.dateForm.get(SEARCH_FORM_METADATA.toDate).value;
      let searchRequest = new SearchRequest();
      // searchFilter = searchFilter?.split(',')[0];
      if (this.searchAddress.street_number) {
        searchRequest.SearchFilterStreet = this.searchAddress.street_number;
      }
      if (this.searchAddress.locality) {
        searchRequest.SearchFilterCity = this.searchAddress.locality;
      }
      searchRequest.Latitude = +this.currentLocation.lat;
      searchRequest.Longititude = +this.currentLocation.lng;
      searchRequest.FromDate = fromDate;
      searchRequest.ToDate = toDate;
      searchRequest.FromTime = moment(searchRequest.FromDate).format("hh:mm:ss A");
      searchRequest.ToTime = moment(searchRequest.ToDate).format("hh:mm:ss A");
      //searchRequest.mode = this.mode;
      // this.searchService.fromDate = this.dateForm.get(
      //   SEARCH_FORM_METADATA.fromDate
      // ).value;
      // this.searchService.toDate = this.dateForm.get(
      //   SEARCH_FORM_METADATA.toDate
      // ).value;

      console.log("this.selectedModethis.selectedMode:::::", this.selectedMode)

      if (this.selectedMode == Mode.City) {
        this.placesService.getSearchResultForAuto(searchRequest)
          .subscribe((response) => {
            // this.setplaces(response);
            this.parkingDetailsList = response.data;
            this.searchobject= response.data;
            console.log("response",response.data);
            this.loading.dismiss();
          }, (error) => {
            // this.displayedPlaces = [];
            // this.places = [];
            // this.showSpin = false;
            this.httpError = error;
            console.log("error=",error)
            console.log("err=",error.error)
            if(error.error){
              this.showMessage = true;
              this.message = error.error.errors[0].message;
              console.log("messhg=",this.message);
              this.loading.dismiss();
            }
          });
      }
      else if(this.selectedMode == Mode.Airport){
        this.placesService.GetSearchResultforAirPort(searchRequest)
        .subscribe((response) => {
          // this.setplaces(response);
          this.parkingDetailsList = response.data;
          this.searchobject= response.data;
          console.log("response",response.data);
          this.loading.dismiss();
        }, (error) => {
          // this.displayedPlaces = [];
          // this.places = [];
          // this.showSpin = false;
          this.httpError = error;
          console.log("error=",error)
          console.log("err=",error.error)
          if(error.error){
            this.showMessage = true;
            this.message = error.error.errors[0].message;
            console.log("messhg=",this.message);
            this.loading.dismiss();
          }
        });
      }
      else if(this.selectedMode == Mode.TruckandTrailor){
        this.placesService.GetSearchResultforTruckAndTrailer(searchRequest)
        .subscribe((response) => {
          // this.setplaces(response);
          this.parkingDetailsList = response.data;
          this.searchobject= response.data;
          console.log("response",response.data);
          this.loading.dismiss();
        }, (error) => {
          // this.displayedPlaces = [];
          // this.places = [];
          // this.showSpin = false;
          this.httpError = error;
          console.log("error=",error)
          console.log("err=",error.error)
          if(error.error){
            this.showMessage = true;
            this.message = error.error.errors[0].message;
            console.log("messhg=",this.message);
            this.loading.dismiss();
          }
        });
      }
      else if(this.selectedMode == Mode.Boat){
        this.placesService.GetSearchResultforBoats(searchRequest)
        .subscribe((response) => {
          // this.setplaces(response);
          this.parkingDetailsList = response.data;
          this.searchobject= response.data;
          console.log("response",response.data);
          this.loading.dismiss();
        }, (error) => {
          // this.displayedPlaces = [];
          // this.places = [];
          // this.showSpin = false;
          this.httpError = error;
          console.log("error=",error)
          console.log("err=",error.error)
          if(error.error){
            this.showMessage = true;
            this.message = error.error.errors[0].message;
            console.log("messhg=",this.message);
            this.loading.dismiss();
          }
        });
      }
      else if(this.selectedMode == Mode.SemiTruck){
        this.placesService.GetSearchResultforSemiTruck(searchRequest)
        .subscribe((response) => {
          // this.setplaces(response);
          this.parkingDetailsList = response.data;
          this.searchobject= response.data;
          console.log("response",response.data);
          this.loading.dismiss();
        }, (error) => {
          // this.displayedPlaces = [];
          // this.places = [];
          // this.showSpin = false;
          this.httpError = error;
          console.log("error=",error)
          console.log("err=",error.error)
          if(error.error){
            this.showMessage = true;
            this.message = error.error.errors[0].message;
            console.log("messhg=",this.message);
            this.loading.dismiss();
          }
        });
      }
      else if(this.selectedMode == Mode.Helicopter){
        this.placesService.GetSearchResultforHelicopter(searchRequest)
        .subscribe((response) => {
          // this.setplaces(response);
          this.parkingDetailsList = response.data;
          this.searchobject= response.data;
          console.log("response",response.data);
          this.loading.dismiss();
        }, (error) => {
          // this.displayedPlaces = [];
          // this.places = [];
          // this.showSpin = false;
          this.httpError = error;
          console.log("error=",error)
          console.log("err=",error.error)
          if(error.error){
            this.showMessage = true;
            this.message = error.error.errors[0].message;
            console.log("messhg=",this.message);
            this.loading.dismiss();
          }
        });
      }
      else if(this.selectedMode == Mode.Seaplane){
        this.placesService.GetSearchResultforSeaPlanes(searchRequest)
        .subscribe((response) => {
          // this.setplaces(response);
          this.parkingDetailsList = response.data;
          this.searchobject= response.data;
          console.log("response",response.data);
          this.loading.dismiss();
        }, (error) => {
          // this.displayedPlaces = [];
          // this.places = [];
          // this.showSpin = false;
          this.httpError = error;
          console.log("error=",error)
          console.log("err=",error.error)
          if(error.error){
            this.showMessage = true;
            this.message = error.error.errors[0].message;
            console.log("messhg=",this.message);
            this.loading.dismiss();
          }
        });
      }
    } 
  }

  createForms() {
    let now = new Date();
    let minutes = now.getMinutes();
    let hours = now.getHours();
    let m = (Math.round(minutes / 15) * 15) % 60;
    let h = minutes > 52 ? (hours === 23 ? 0 : ++hours) : hours;
    let quarterIntervalDate = new Date().setHours(h);
    quarterIntervalDate = new Date(quarterIntervalDate).setMinutes(m);
    quarterIntervalDate = new Date(quarterIntervalDate).setSeconds(0);
    // debugger;
    this.now = moment(quarterIntervalDate);
    const toDate = moment(quarterIntervalDate).add(1, 'h');

    // this.searchForm = this.formBuilder.group({
    //   [SEARCH_FORM_METADATA.searchBar]: ['', [Validators.required]],
    //   [SEARCH_FORM_METADATA.vehicleLength]: [''],
    //   [SEARCH_FORM_METADATA.mode]: [Mode.City],
    // });
    this.dateForm = this.formBuilder.group({
      [SEARCH_FORM_METADATA.fromDate]: [this.now],
      [SEARCH_FORM_METADATA.toDate]: [toDate],
      [SEARCH_FORM_METADATA.sort]: ['']
    });
  }

  goBack(){
    console.log("go back calling")
    this.navCtrl.back();
  }

  booking(parkingDetail) {
    let selectparkingdetails = parkingDetail;
    console.log("parkingDetail =>>", parkingDetail)
    console.log( "  this.searchobject newly created",   this.searchobject)
    this.storage.set('booked', this.item);
    console.log("ADDED TO BAG!!!! (paring detail page-> addtobag)")
    let navigationExtras: any = {
      queryParams: {
        special: JSON.stringify(selectparkingdetails)
      }
    };
    // this.navCtrl.navigateForward('booking', this.searchobject);
    //this.router.navigate(['booking'],navigationExtras );
    
  }
  payment(parkingDetail){
    let selectparkingdetails = parkingDetail;
    let navigationExtras: any = {
      queryParams: {
        special: JSON.stringify(selectparkingdetails)
      }
    };
    this.router.navigate(['paymentinfo'], navigationExtras);

  }
  sort(sortMethod) {

    console.log("Sort method inside sort", sortMethod)
    this.sortMethod = sortMethod;
    if (sortMethod == SortMethodEnum.cheapest) {
      this.parkingDetailsList = sort(this.parkingDetailsList).asc([(u) => u.calculatedAmount]);
      console.log("Sort method inside sort for amount", this.parkingDetailsList);
    } else if (sortMethod == SortMethodEnum.closest) {
      this.parkingDetailsList = sort(this.parkingDetailsList).asc([
        (u) => u.distance,
      ]);
      console.log("Sort method inside sort for for distance", this.parkingDetailsList);
    }
    this.changeDetectorRef.detectChanges();
  }
  
  details(parkingDetail){
    let selectparkingdetails = parkingDetail;
    let navigationExtras: any = {
      queryParams: {
        special: JSON.stringify(selectparkingdetails)
      }
    };
    this.router.navigate(['booking-details'], navigationExtras);
  }

  home(){
    this.router.navigate(['/']);
  }

  
 
async openModal() {
  const modal = await this.modalCtrl.create({
    component: ModalComponent,
    componentProps: { 
      Mode: this.selectedMode,
      
    }
  });
  return await modal.present();
}

// toggleDisplay() {
//   this.isHidden = !this.isHidden;
//   setTimeout(() => {
//     if (!this.isHidden) {
//       this.firstTimeLoad = true;
//       if (this.displayedPlaces.length > 0) {
//         this.initializeMap(this.displayedPlaces[0].latitude, this.displayedPlaces[0].longitude);
//       }
//     }
//   }, 100);

// }

  }
