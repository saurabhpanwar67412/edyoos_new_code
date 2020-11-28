import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController  } from '@ionic/angular';
import { PlacesService } from 'src/app/shared/places.service';
import { AvailableSpotsRequest } from 'src/app/model/Booking/available_spots.model';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-change-date-modal',
  templateUrl: './change-date-modal.page.html',
  styleUrls: ['./change-date-modal.page.scss'],
})
export class ChangeDateModalPage implements OnInit {
  customPickerOptions: any;
  changeddate: Date;
  someVar;
  reserveNow: boolean = false;
  public isGuestUser = false;
  public isGuestUserClicked = false;
  public guestUserEmail: string;
  userName: string;
  public spotDetails: AvailableSpotsRequest;
  bookedPlaces: any[];
  total = 0;
  httpError: any;
  data : any = [] ; 
  startddate : any ; 
  enddate : any; 


  // @ViewChild('std') std;

  constructor(public modalctrl : ModalController, private placesService: PlacesService,
    private route: ActivatedRoute, ) {
   
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
        console.log("this.data from navigation AccountInfo",this.data);
      }
    });
  }

  init() {

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
  }
  fromDateChange(data) {
   console.log("data from date change",data);
   
    let date = data.changeSearchFromDateTime;
    let toDate = data.changesearchToDateTime;
    if (
      date &&
      toDate &&
      moment(date).isSameOrAfter(toDate)
    ) {

      data.isDateRangeValid = false;
    }
    else {
      data.isDateRangeValid = true;
    }

  }

  toDateChange(data) {
    let date = data.changesearchToDateTime;
    let fromDate = data.changeSearchFromDateTime;
    if (
      date &&
      fromDate &&
      moment(date).isSameOrBefore(fromDate)
    ) {
      data.isDateRangeValid = false;

    }
    else {
      data.isDateRangeValid = true;
    }

  }


  filterStart()
  {
    this.someVar = new Date().toISOString();
    console.log("selected date printed",  this.startddate)
   }

  filterEnd(){
    this.someVar = new Date().toISOString();
    console.log("selected date printed",  this.startddate)
  }
  ngOnInit() {
  }
  
  closeModal(data){
    
    data.changeSearchFromDateTime = data.searchFromDateTime;
    data.changesearchToDateTime = data.searchToDateTime;

    this.modalctrl.dismiss({
      'dismissed': true
    });

  }
  changeDateApply(place,index){
    
    console.log("place and index",place, index);

    place.searchFromDateTime = moment(place.changeSearchFromDateTime);
    place.searchToDateTime = moment(place.changesearchToDateTime);

    let fromDate = new Date(place.searchFromDateTime);
    let toDate = new Date(place.searchToDateTime);

    if (!moment(place.searchFromDateTime).isSameOrBefore(new Date())) {
      place.showDateError = false;
    }

    let availableSpotsRequest = new AvailableSpotsRequest();
    availableSpotsRequest.PropertyGroupID = place.propertyGroupID;
    availableSpotsRequest.FromDate = fromDate;
    availableSpotsRequest.ToDate = toDate;
    availableSpotsRequest.FromTime = moment(fromDate).format("hh:mm:ss A");
    availableSpotsRequest.ToTime = moment(toDate).format("hh:mm:ss A");
    availableSpotsRequest.PropertyGroupAmount = place.pricingAmount;
    availableSpotsRequest.PriceCode = place.pricingCode;

    this.placesService.SpotAvalibilityCheckonCheckOut(availableSpotsRequest)
      .subscribe((response) => {
        console.log("response inside api call",response);

        this.bookedPlaces[index].isSpotAvaliable = response.data.isSpotAvaliable;
        this.bookedPlaces[index].calculatedAmount = response.data.propertyGroupAmount;

        if (this.bookedPlaces[index].discountedPrice) {
          let discount =
            this.bookedPlaces[index].calculatedAmount * (this.bookedPlaces[index].discountedPrice / 100);
          this.bookedPlaces[index].checkoutAmount = this.bookedPlaces[index].calculatedAmount - discount;
        }
        else {
          this.bookedPlaces[index].checkoutAmount = this.bookedPlaces[index].calculatedAmount;
        }

        this.placesService.cartPropertyGroup = this.bookedPlaces;
        this.placesService.addedCartPropertyGroup.next(this.bookedPlaces);

      }, (error) => {
        this.httpError = error;

      });

  }



}
