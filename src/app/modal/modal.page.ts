import { Component, ViewChild, OnInit, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { ModalController  } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import {  ToastController,MenuController, LoadingController, Config, ActionSheetController, Platform } from '@ionic/angular';
import { AlertController  } from '@ionic/angular';
import {MatSelectModule} from '@angular/material/select';
import { SearchRequest } from 'src/app/model/search/search_request.model';
import * as moment from 'moment';
import { convertIntoDate } from 'src/app/shared/datetime.utility';
import { Mode, vehicleCategoryEnum } from 'src/app/modal/modal.component.metadata';
import { PlacesService } from 'src/app/shared/places.service';
import { IPlace } from 'src/app/shared/place';
import { AvailableSpotsRequest } from 'src/app/model/Booking/available_spots.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})

export class ModalPage implements OnInit ,AfterViewInit{

  searchForm: FormGroup;

  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  places: IPlace[];
  confDate: string;
  showSearchbar: boolean;
  lat;
  lng;
  selectedMode = "city";
  displayLength;
  sortMethod;
  httpError: any;
  displayedPlaces: any[];
  placesLoaded;
  hideExtra;
  placesCount;
  now;
  latitude: number = 0;
  longitude: number = 0;
  geo: any;
  geoCoder;
  selectedRadioGroup:any;
  place:any

  componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'short_name',
    postal_code: 'short_name',
  };


  @ViewChild('map', { static: false }) mapElement: ElementRef;
  address: string;
  map:any
  long: string;
  autocomplete: { input: string; };
  checkIn:any;
  checkOut:any;
  parkingType:any;
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  currentLocation:any;
  loading: any;
  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  Mode;
  vehicleCategoryEnum = vehicleCategoryEnum;
  searchAddress: any = {};
  userdetails : any ;
  flag:any;
  parkingData:any;
  
  modes = [ 'city' , 'airplane' , 'Truck & Trailer Parking' ,'boats', 'Semi-Truck Parking' ] ;
imageurls = ['assets/images/BlueColor-jpg/CityParking@1x.jpg','assets/images/BlueColor-jpg/Airport@1x.jpg','assets/images/BlueColor-jpg/Truck@1x.jpg','assets/images/BlueColor-jpg/Boat@1x.jpg','assets/images/BlueColor-jpg/SemiTruck@1x.jpg',]
  
  constructor(private route: ActivatedRoute,
    private menu: MenuController,
    public config: Config,
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private ngZone: NgZone,
    private platform: Platform,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public modalCtrl :ModalController,
    private fb: FormBuilder,
    private placesService: PlacesService,
    private navParams: NavParams) {

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
   }
  ngAfterViewInit(): void {
    console.log("elem=",this.parkingType)
    // this.parkingType.value(this.selectedMode);
  }



dismiss() {
    this.modalCtrl.dismiss();
  }
  
  async ngOnInit(){
    this.searchForm = this.fb.group({
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      searchCityValue:[]
    })
    this.loadMap();
    this.ios = this.config.get('mode') === 'ios';
    // this.getDataFromQueryParams();
    console.log("searchAddress=",this.searchAddress)
    console.log("selectedMode=",this.selectedMode)
    this.autocomplete.input = this.searchAddress.place;  
    this.parkingType = this.searchAddress.selectedMode;
    this.selectedMode = this.searchAddress.selectedMode;
   this.flag = this.flag;


   if(this.searchAddress.latitude){
    this.currentLocation = {
      lat: this.searchAddress.latitude,
      lng: this.searchAddress.longitude,

    };
   }
   this.parkingData = this.parkingData
    console.log("searchAddress here=",this.searchAddress+"flag="+this.flag)
    // throw new Error('Method not implemented.');
    if(this.searchAddress.fromDate){
        this.checkIn = this.searchAddress.fromDate;
        this.checkIn = moment(this.checkIn).format('MM-DD-YYYY hh:mm:ss A');
        this.checkOut = this.searchAddress.toDate;
        this.checkOut = moment(this.checkOut).format('MM-DD-YYYY hh:mm:ss A');
    }else{
      this.checkIn = new Date().toISOString();
      this.checkOut = moment(this.checkIn).add(1, 'h').format('MM-DD-YYYY hh:mm:ss A');
    }
  }
  
    //LOADING THE MAP HAS 2 PARTS.
    loadMap() {

      // console.log("placeAddressComponents=",place.address_components);
  
      //FIRST GET THE LOCATION FROM THE DEVICE.
      this.geolocation.getCurrentPosition().then((resp) => {
        console.log("res=", resp)
  
        let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
  
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
          }, // here´s the array of controls
          disableDefaultUI: true, // a way to quickly hide all controls
          scaleControl: true,
          zoomControl: true,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE 
          },
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
  
        //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
        this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
  
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        // this.currentLocation = {
        //   lat: this.map.center.lat(),
        //   lng: this.map.center.lng(),
  
        // };
  
        this.map.addListener('tilesloaded', () => {
          console.log('accuracy', this.map, this.map.center.lat());
          this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
          this.lat = this.map.center.lat()
          this.long = this.map.center.lng()
        });
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }


  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        console.log("i got=", result[0]);
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);
        }
        console.log("responAdde=", responseAddress);
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
        console.log("this address=", this.address);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
        console.log("error this address=", this.address);
      });
  }

  //FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
  ShowCords() {
    // alert('lat' + this.lat + ', long' + this.long)
  }

  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            //  console.log("prediction=",prediction);
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  //wE CALL THIS FROM EACH ITEM.
  SelectSearchResult(item) {
    console.log("itemmm in SelectSearchResult:::", item)
    //this.presentFilter();
    this.geo = item.description;
    this.autocomplete.input = item.description;
    this.autocompleteItems = [];
    this.geoCode(this.geo)
    //convert Address to lat and long
    // alert(JSON.stringify(item))
    //     if (item.types[0]=='route') {
    //     search.street = item.structured_formatting.main_text;
    //   }
    //  length = item.terms.length;
    //     search.locality = item.terms[0].value;

    this.placeid = item.place_id
    // this.GoTo();  
  }

onSubmit(): void {

  
    }

  //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
  ClearAutocomplete() {
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }

  //sIMPLE EXAMPLE TO OPEN AN URL WITH THE PLACEID AS PARAMETER.
  GoTo() {
    return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=' + this.placeid;
  }


  //convert Address string to lat and long
  geoCode(address: any) {
    console.log("in method geoCode")
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
      let place = results[0];
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
      this.currentLocation = {
        lat: this.latitude,
        lng: this.longitude,
      };
         this.searchObjNavigate(this.selectedMode,place);
      // this.presentFilter(place);
      //this.presentFilter.dismiss();
    });
  }


  getCurrentLocation() {
    this.geolocation.getCurrentPosition().then((position) => {
      console.log("position=", position);
      // 35.7021051,139.7750452 Akihabara
      // 47.59948195707674, -122.30985900179657 somewhere in USA
      // 30.0443567,31.2356568 Tahrir Square
      this.currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      console.log("currentLocation=", this.currentLocation);
      this.getAddress(this.currentLocation);
    });
  }

  getAddress(address: google.maps.LatLngLiteral) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: address.lat, lng: address.lng } },
      (results, status) => {

        console.log(results);
        console.log(status);

        // if (status === 'OK') {
          if (results[0]) {
            // debugger
            let address: any = {};
            // if(results[0].address_components[2].short_name)
            // address=results[0].address_components[2].short_name;
            // if(results[0].address_components[2].short_name)
            let place = results[0];
            console.log("place place=", results[0]);
            //this.searchObjNavigate(place);
          
            // this.searchForm.updateValueAndValidity();
          }
        }
      //}
    );
  }


  searchObjNavigate(mode,place) {
     
    console.log("data from pop p ::::" , mode , place );
    for (var i = 0; i < place.address_components.length; i++) {

      var addressType = place.address_components[i].types[0];
      if (this.componentForm[addressType]) {
        var val = place.address_components[i][this.componentForm[addressType]];

        if (addressType == 'street_number' || addressType == 'route') {
          this.searchAddress.street_number = this.searchAddress.street_number ? this.searchAddress.street_number + ' ' + val :
            val;
        }
        else if (addressType == 'locality') {
          // address.locality=address+','+val;
          this.searchAddress.locality = val;
        }
        else if (addressType == 'administrative_area_level_1') {
          // address=address+','+val;
          this.searchAddress.administrative_area_level_1 = val;
        }

        else if (addressType == 'country') {
          // address.country=address+','+val;
          this.searchAddress.country = val;
        }
       }
    }
    this.place = place.formatted_address;

    //  this.router.navigate(['/parking-detail', search]);
    // this.dismiss();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }

  
  
parkingtype(parkingtype){

this.selectedMode = parkingtype;
  
  console.log("id from button click", parkingtype );


}
  

  home(){
    this.router.navigate(['/']);
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
      // this.search();
    })
  }



  search(index){
    console.log("in search elem=",this.parkingType)
    console.log("checkin=",this.checkIn)
    console.log("checkout=",this.checkOut)
    let fromDate = this.checkIn;
    console.log("frDt="+fromDate)
   let toDate = this.checkOut;
   console.log("toDt="+toDate);
   console.log("this.autocomplete.input=",this.autocomplete.input);

this.searchAddress = this.navParams.get('searchAddress');
  //  this.searchAddress.fromDate = fromDate;
  //  this.searchAddress.toDate = toDate;
let searchRequest = new SearchRequest();

      console.log("this.searchAddress=",this.searchAddress)
      if (this.searchAddress.street_number) {
        searchRequest.SearchFilterStreet = this.searchAddress.street_number;
      }
      if (this.searchAddress.locality) {
        searchRequest.SearchFilterCity = this.searchAddress.locality;
      }
      if (this.searchAddress.state) {
        searchRequest.SearchFilterState = this.searchAddress.state;
      }

      searchRequest.Latitude = +this.currentLocation.lat;
      searchRequest.Longititude = +this.currentLocation.lng;

      searchRequest.FromDate = new Date(convertIntoDate(fromDate));
      searchRequest.ToDate = new Date(convertIntoDate(toDate));

      searchRequest.FromTime = moment(fromDate).format("hh:mm:ss A");
      searchRequest.ToTime = moment(toDate).format("hh:mm:ss A");


      let search: any = {};
    let length;
    search.lat = searchRequest.Latitude;
    search.lng = searchRequest.Longititude;
    search.mode = this.selectedMode;


    if (this.searchAddress.street_number)
      search.street = this.searchAddress.street_number;
    if (this.searchAddress.locality)
      search.locality = this.searchAddress.locality;

      search.fromDate = fromDate;
      search.toDate = toDate;
      search.fromTime = searchRequest.FromTime;
      search.toTime = searchRequest.ToTime;
      search.place = this.autocomplete.input;
    console.log("search=", search);

    
      console.log("searchRequest=",searchRequest);
      console.log("Modeee=",this.selectedMode)
      if(this.flag!='parking'){
        this.router.navigate(['/parking-detail', search]);
    }else{
      let availableSpotsRequest = new AvailableSpotsRequest();
      availableSpotsRequest.PropertyGroupID = this.parkingData.propertyGroupID;
      availableSpotsRequest.FromDate = fromDate;
      availableSpotsRequest.ToDate = toDate;
      availableSpotsRequest.FromTime = moment(fromDate).format("hh:mm:ss A");
      availableSpotsRequest.ToTime = moment(toDate).format("hh:mm:ss A");
      availableSpotsRequest.PropertyGroupAmount = this.parkingData.pricingAmount;
      availableSpotsRequest.PriceCode = this.parkingData.pricingCode;

      console.log("availableSpotsRequest=",availableSpotsRequest)
      this.placesService.SpotAvalibilityCheckonCheckOut(availableSpotsRequest)
      .subscribe((response) => {
        this.parkingData.changeDateClick=false;
        console.log("response in modal=",response);
        console.log("parkingData before=",this.parkingData);
        this.parkingData.isSpotAvaliable = response.data.isSpotAvaliable;
        this.parkingData.calculatedAmount = response.data.propertyGroupAmount;

        if (this.parkingData.discountedPrice) {
          let discount =
            this.parkingData.calculatedAmount * (this.parkingData.discountedPrice / 100);
          this.parkingData.checkoutAmount = this.parkingData.calculatedAmount - discount;
        }
        else {
          this.parkingData.checkoutAmount = this.parkingData.calculatedAmount;
        }
        console.log("parkingData after=",this.parkingData);

        this.placesService.cartPropertyGroup = this.parkingData;
        this.placesService.addedCartPropertyGroup.next(this.parkingData);

     let selectparkingdetails = this.parkingData;
    console.log("parkingDetail =>>", selectparkingdetails)
    // this.storage.set('booked', this.item);
    let navigationExtras: any = {
      queryParams: {
        special: JSON.stringify(selectparkingdetails),
        searchAddress:JSON.stringify(this.searchAddress)
      }
    };
    console.log("Modal Details navigationExtras=",navigationExtras);
    // this.navCtrl.navigateForward('booking', this.searchobject);
    this.router.navigate(['booking'],navigationExtras );
        // this.changeDateCancelClick(place);
      }, (error) => {
        this.httpError = error;
      });
    }
    
    this.dismiss();
   }


   setplaces(response) {
    // this.searchBtnDisabled = false;
    this.places = response.data;
    console.log(this.places);

    // const vehicleCategory = Object.keys(this.vehicleCategoryEnum);

    let searchDetails: any[] = [];

    this.places.forEach((val) => {
      if (val.vehicleCategoryID == this.vehicleCategoryEnum[this.selectedMode]) {
        searchDetails.push(val);
      }
    })

    this.places.forEach((val) => {
      if (val.vehicleCategoryID != this.vehicleCategoryEnum[this.selectedMode]) {
        searchDetails.push(val);
      }
    })
    this.places = searchDetails;

    // this.places.sort(function (a, b) {
    //   return a.distance - b.distance;
    // });

    this.displayedPlaces = this.places.filter(s => s.distance < 25);
    if (this.places.length >= 20) {
      this.displayedPlaces = this.places.slice(0, 20);
      this.hideExtra = true;
      this.placesCount = this.places.length - this.displayedPlaces.length;
    }
    else if (this.displayedPlaces.length == 0) {
      this.displayedPlaces = this.places;
    }
    else if (this.places.length > this.displayedPlaces.length) {
      this.placesCount = this.places.length - this.displayedPlaces.length;
      this.hideExtra = true;
    }
    else {
      this.hideExtra = false;
    }

    this.placesLoaded = true;
    // this.changeDetectorRef.detectChanges();
    // if (this.displayedPlaces.length > 0) {
    //   this.initializeMap(this.displayedPlaces[0].latitude, this.displayedPlaces[0].longitude);
    // }


  }

  changeMode(){
    console.log("this.parkingType=",this.parkingType)
    this.selectedMode=this.parkingType
  }



}
