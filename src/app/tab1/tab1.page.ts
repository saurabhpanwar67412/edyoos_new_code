import { Component, ViewChild, OnInit, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import {  ToastController,MenuController, LoadingController, Config, ActionSheetController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController  } from '@ionic/angular';
import {MatSelectModule} from '@angular/material/select';



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
  // Add it as a property:
  

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

  fromparkingflag : boolean ;
image : any ;
  markers: google.maps.Marker[] = [];
  userdetails : any ;
  
  modes = [ 'city' , 'airplane' , 'Truck & Trailer Parking' ,'boats', 'Semi-Truck Parking' ] ;
imageurls = ['assets/images/BlueColor-jpg/CityParking@1x.jpg','assets/images/BlueColor-jpg/Airport@1x.jpg','assets/images/BlueColor-jpg/Truck@1x.jpg','assets/images/BlueColor-jpg/Boat@1x.jpg','assets/images/BlueColor-jpg/SemiTruck@1x.jpg',]
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
    private alertCtrl: AlertController,
    
    
  ) {

    this.userdetails = JSON.parse(localStorage.getItem('edyoosUserDetails'));
    // this.displayedPlaces = localStorage.getItem('selectparkingdetails');
    console.log("userid", this.userdetails);
    // let userid= this.userdetails.id
    if(this.userdetails == null ){
      this.router.navigate(['welcome']);
     }
    else {
     console.log("i am else from tab2page ");
     
    }
    // debugger;
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.displayedPlaces = JSON.parse(params.special);
        console.log("this.data from navigation tab 1",this.displayedPlaces);
      }
    });

    // this.displayedPlaces = JSON.parse(localStorage.getItem('selectparkingdetails'));
    
    console.log("flag", );
   
   if(this.displayedPlaces){

     this.fromparkingflag = true;
     
   }
   else{
     this.fromparkingflag = false;
   }
    console.log("data from parking details for view map",this.displayedPlaces);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
   
  }

  isClick: boolean=false;

isClicked(){
 return this.isClick;
}

  ngAfterViewInit() {
    console.log("ng tab1 after called")
    // this.loadMap();
    // throw new Error('Method not implemented.');
  }
  searchAddress: any = {};
  
  async ngOnInit(){
    this.autocomplete.input = '';
   
    console.log("data from displayed places", this.displayedPlaces);
    
      // this.viewonmapload();
      // this.ios = this.config.get('mode') === 'ios';

  
    this.loadMap(this.displayedPlaces);
    this.ClearAutocomplete();
    this.ios = this.config.get('mode') === 'ios';
    // throw new Error('Method not implemented.');

  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }
  clearMarkers() {
    this.setMapOnAll(null);
  }
  setMapOnAll(map) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  viewonmapload(){
    this.deleteMarkers();
     
  
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
        this.image = {
          url:
            `${location.origin}/assets/images/map-marker-icon.png`,
          // This marker is 20 pixels wide by 32 pixels high.
          //  size: new google.maps.Size(20, 32),
          // The origin for this image is (0, 0).
          // origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          //  anchor: new google.maps.Point(0, 32),
          // scaledSize: new google.maps.Size(32, 38),
          labelOrigin: new google.maps.Point(17, 15)
  
        };
  
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
      for (let i = 0; i < this.displayedPlaces.length; i++) {
        console.log("I value from home", i );
      this.addMarker(this.displayedPlaces[i], i)
    }
    if (this.displayedPlaces.length > 0) {
      this.map.setCenter(this.markers[0].getPosition());
      this.map.setZoom(14);

    }

  }

  
openbagInTab(){
  this.router.navigateByUrl('/tabs/tab4');

}
openparkingInTab(){
  this.router.navigateByUrl('/');
}
openbookingInTab(){
  this.router.navigateByUrl('/tabs/tab3');
  
}


    //LOADING THE MAP HAS 2 PARTS.
    loadMap(displayedPlaces) {
      console.log("displayedPlaces from loadmap", displayedPlaces);

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
          disableDefaultUI: true, // a way to quickly hide all controls
        }

     
        //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
        this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.currentLocation = {
          lat: this.map.center.lat(),
          lng: this.map.center.lng(),
        };
        for (let i = 0; i < this.displayedPlaces.length; i++) {
          this.addMarker(this.displayedPlaces[i], i)
        }
        if (this.displayedPlaces.length > 0) {
          this.map.setCenter(this.markers[0].getPosition());
          this.map.setZoom(14);
    
        }
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

    
    hover_image: any;
    addMarker(place, i) {

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(place.latitude, place.longitude),
        map: this.map,
  
        // label: '$' + place.pricingAmount,
        label: {
          color: 'red',
          fontSize: Number(place.calculatedAmount) > 99 ? '8px' : '10px',
          fontWeight: '900',
          text: '$' + Number(place.calculatedAmount).toFixed()
  
        },
        icon: this.image,
        // shape: shape,
        zIndex: i + 1
      });
  
      google.maps.event.addListener(marker, 'click', ((marker, i) => {
        return () => {
          console.log("hello")
          // this.goToPlace(place);
        };
      })(marker, i));
  
      google.maps.event.addListener(marker, 'mouseover', ((marker, i) => {
        return () => {
  
          for (var j = 0; j < this.markers.length; j++) {
            this.markers[j].setIcon(this.image);
            this.markers[j].setZIndex(j + 1);
          }
          marker.setIcon(this.hover_image);
          marker.setZIndex(1000);
          let markerLabel = marker.getLabel();
          markerLabel.color = 'white'
          marker.setLabel(markerLabel);
  
        };
      })(marker, i));
  
      google.maps.event.addListener(marker, 'mouseout', ((marker, i) => {
        return () => {
  
          for (var j = 0; j < this.markers.length; j++) {
            this.markers[j].setIcon(this.image);
            this.markers[j].setZIndex(j + 1);
            let markerLabel = marker.getLabel();
            markerLabel.color = 'red'
            marker.setLabel(markerLabel);
          }
        };
      })(marker, i));
  
      this.markers.push(marker);
  
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


  searchObjNavigate(mode,place) {
     
    console.log("data from pop p ::::" , mode , place );
    console.log("place=",place);
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

      search.place = place.formatted_address;
     
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

  
  
parkingtype(parkingtype){
  this.isClick=!this.isClick;
this.selectedMode = parkingtype;
  
  console.log("id from button click", parkingtype );
}
  

  home(){
    this.router.navigate(['/']);
  }


}
