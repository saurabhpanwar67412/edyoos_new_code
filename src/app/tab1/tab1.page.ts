import { Component, ViewChild, OnInit, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import {  ToastController,MenuController, LoadingController, Config, ActionSheetController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController  } from '@ionic/angular';


declare var google;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterViewInit {
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
  selectedMode;
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

  constructor(
    private route: ActivatedRoute,
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
    private alertCtrl: AlertController
  ) {

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
  ngAfterViewInit() {
    console.log("ng tab1 after called")
    // this.loadMap();
    // throw new Error('Method not implemented.');
  }
  searchAddress: any = {};
  
  async ngOnInit(){
    this.loadMap();
    this.ios = this.config.get('mode') === 'ios';
    // throw new Error('Method not implemented.');
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
      // this.searchObjNavigate(place);
      this.presentFilter(place);
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
            this.presentFilter(place);
            // this.searchForm.updateValueAndValidity();
          }
        }
      }
    );
  }


  searchObjNavigate(data,place) {
     
    console.log("data from pop p ::::" , data , place );
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
    search.mode = data;


    if (this.searchAddress.street_number)
      search.street = this.searchAddress.street_number;
    if (this.searchAddress.locality)
      search.locality = this.searchAddress.locality;

    console.log("search=", search);
    this.router.navigate(['/parking-detail', search]);

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

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {

          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'caret-forward-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {

          console.log('Cancel clicked');
        }
      }]
    });
    for (let i = 0; i < 10; i++) {
      var button = {
        text: 'button' + i,
        handler: () => {
          console.log(i)
        }
      }
    }
    await actionSheet.present();
  }

  async presentFilter(place){
    //alert("filter clicked!!")
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Types of parking',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: 'City Parking',
          value: 'city',
          checked: true
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'Airport Parking',
          value: 'airplane'
        },
        {
          name: 'radio3',
          type: 'radio',
          label: 'Truck & Trailer Parking',
          value: 'value3'
        },
        {
          name: 'radio4',
          type: 'radio',
          label: 'Boat Parking',
          value: 'boats'
        },
        {
          name: 'radio5',
          type: 'radio',
          label: 'Semi-Truck Parking',
          value: 'value5'
        },
        {
          name: 'radio6',
          type: 'radio',
          label: 'Seaplane Parking',
          value: 'seaplanes'
        },
        {
          name: 'radio6',
          type: 'radio',
          label: 'Helicopter Parking',
          value: 'helicopter'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data:string) => {
            console.log('Confirm Ok');
            console.log("filter selected::: with place", data, place)
            this.searchObjNavigate(data, place);
          }
        }
      ]
    });
    await alert.present();
  }

  




}