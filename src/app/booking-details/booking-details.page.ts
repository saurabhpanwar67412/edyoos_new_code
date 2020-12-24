import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {

  item:any=[];
  amenities:any=[];
  imageurl: string;

  //operationaldays:any=[];

  constructor(private route: ActivatedRoute, private router: Router) 
  { 
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.item = JSON.parse(params.special);
        console.log("this.data on booking-details page::",this.item);
      }
    });

    this.amenities =this.item.amenities;
    //this.operationaldays = this.item.searchParkingOperationHours;
    //console.log("this.operationaldaysthis.operationaldays:::::", this.operationaldays);
  }

  ngOnInit() {
    this.imageurl = environment.blobURL + '/images/Amenieties' ;
    console.log("this.imageurlthis.imageurl:::::", this.imageurl);
  }

  proceedtopay(){

    let selectparkingdetails = this.item;
    console.log("parkingDetail =>>", selectparkingdetails)
    this.storage.set('booked', this.item);
    let navigationExtras: any = {
      queryParams: {
        special: JSON.stringify(selectparkingdetails)
      }
    };
    // this.navCtrl.navigateForward('booking', this.searchobject);
    this.router.navigate(['booking'],navigationExtras );

}

  back(){
    this.navctrl.pop();
  }

}
