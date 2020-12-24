import { Component, ViewChild, OnInit, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import {  ToastController,MenuController, LoadingController, Config, ActionSheetController, Platform } from '@ionic/angular';
import { AlertController  } from '@ionic/angular';
import {MatSelectModule} from '@angular/material/select';
import { GoogleMap } from '@angular/google-maps';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
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
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  currentLocation;
  loading: any;
  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  Mode;
  searchAddress: any = {};
  userdetails : any ;
  
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
    public modalCtrl :ModalController,) {

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
   }



dismiss() {
    this.modalCtrl.dismiss();
  }

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
  }getAddress(address: google.maps.LatLngLiteral) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: address.lat, lng: address.lng } },
      (results, status) => {

        console.log(results);
        console.log(status);

        if (status === 'OK') {
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
      }
    );
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
  SelectSearchResult(item) {
    console.log("itemmm in SelectSearchResult:::", item)
    //this.presentFilter();
    this.geo = item.description;
    this.geoCode(this.geo);//convert Address to lat and long
    // alert(JSON.stringify(item))
    //     if (item.types[0]=='route') {
    //     search.street = item.structured_formatting.main_text;
    //   }
    //  length = item.terms.length;
    //     search.locality = item.terms[0].value;

    this.placeid = item.place_id
    // this.GoTo();  
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
  ClearAutocomplete() {
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }
  parkingtype(parkingtype){

    this.selectedMode = parkingtype;
      
      console.log("id from button click", parkingtype );
    
    
    }

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
        this.currentLocation = {
          lat: this.map.center.lat(),
          lng: this.map.center.lng(),
  
        };

  
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


    async ngOnInit(){
      this.loadMap();
      this.ios = this.config.get('mode') === 'ios';
      // throw new Error('Method not implemented.');
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
    

    let search: any = {};
    let length;
    search.lat = this.currentLocation.lat;
    search.lng = this.currentLocation.lng;
    search.mode = mode;


    if (this.searchAddress.street_number)
      search.street = this.searchAddress.street_number;
    if (this.searchAddress.locality)
      search.locality = this.searchAddress.locality;

    console.log("search=", search);
    this.router.navigate(['/parking-detail', search]);

  }



}
