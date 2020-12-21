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


@Component({
  selector: 'app-parking-detail',
  templateUrl: './parking-detail.page.html',
  styleUrls: ['./parking-detail.page.scss'],
})
export class ParkingDetailPage implements OnInit,AfterViewInit {

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
  selectedMode:any;

  constructor( private route: ActivatedRoute,
    private placesService: PlacesService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private router: Router,
    public modalController: ModalController) {
      this.createForms();
      alert("inside parking detail page!");
  }

  async ngAfterViewInit() {
   
    // throw new Error('Method not implemented.');
  }

  async ngOnInit() {
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
    let navigationExtras: any = {
      queryParams: {
        special: JSON.stringify(selectparkingdetails)
      }
    };
    // this.navCtrl.navigateForward('booking', this.searchobject);
    this.router.navigate(['booking'],navigationExtras );
    
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

  // async details(parkingDetail){
  //   this.navdata = parkingDetail;
  //   console.log("parkingDetail clicked or choosed.", parkingDetail)
  //   var data = { message : 'hello world' };
  //    var modalPage = await this.modalController.create(
  //      {
  //        component:ModalPagePage,
  //        componentProps: {
  //         'message': this.navdata,  
  //       }
  //      }
  //    ); 
  //    return await modalPage.present();
  // }

  home(){
    this.router.navigate(['/']);
  }
  }
