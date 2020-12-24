import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {

  item:any=[];
  amenities:any=[];
  //operationaldays:any=[];

  constructor(private route: ActivatedRoute, private router: Router) 
  { 
    console.log("testing inside booking page");
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

  }

  home(){
    this.router.navigate(['/']);
  }

}
