import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Router, ActivatedRoute } from '@angular/router';
import { PlacesService } from '../shared/places.service';
import { UserService } from '../shared/user.service';
import { AuthenticationService } from '../shared/authentication/authentication.service';


@Component({
  selector: 'app-mybag',
  templateUrl: './mybag.page.html',
  styleUrls: ['./mybag.page.scss'],
})
export class MybagPage implements OnInit {
  
  ordersCount:number=0;
  cartPropertyGroup:any[]=this.placesService.cartPropertyGroup;
  collapsed = true;
  isLoggedIn;
  cartTopStyle = '-1503px';
  localdata : any ; 

  constructor(private storage: Storage,
    public router: Router,
    private placesService: PlacesService,
    private userService: UserService,
    private authenticationService: AuthenticationService) { 
      this.storage.get('booked').then((val) => {
        console.log('Your age is', val[0]);
        this.localdata =  val;
      });
   
  }


  
 

  ngOnInit(): void {
    if(this.authenticationService.userValue){
      console.log("if called");
      this.isLoggedIn = true;
    }
    else{
      console.log("else called");
      this.isLoggedIn = false;
    }

    let userdetails = JSON.parse(localStorage.getItem('edyoosUserDetails'));
    
    if (localStorage.getItem('edyoosUserDetails')) {
      this.isLoggedIn = true;
    }
    else{

      this.isLoggedIn = false;
    }

    this.ordersCount = this.placesService.cartPropertyGroup.length;
    this.placesService.addedCartPropertyGroup.subscribe((value:any[]) => {
      this.ordersCount = value.length;
      this.cartPropertyGroup=value;
      if(this.ordersCount==0){
        this.cartTopStyle = '-1503px';
      }
      console.log("value from order cart", value);
      
    });
    

    this.authenticationService.user.subscribe((user) => {
     if(user){
      console.log("if called");
      this.isLoggedIn = true;
     }
     else{
      console.log("if called");
      this.isLoggedIn = false;
     }
    });
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  openCartDetails() {
    if (this.cartTopStyle == '53px') {
      this.cartTopStyle = '-1503px'
    }
    else {
      this.cartTopStyle = '53px'
    }
  }

  goToPlace(val:any) {
    console.log(val);

        let detailsRequest:any={};

        detailsRequest.searchfilter = val.city;
        detailsRequest.latitude = val.latitude;
        detailsRequest.longititude = val.longitude;
        detailsRequest.fromdate = val.fromDate;
        detailsRequest.todate = val.toDate;
        detailsRequest.fromtime = new Date(val.fromDate).toLocaleTimeString();
        detailsRequest.totime = new Date(val.todate).toLocaleTimeString();
        detailsRequest.parkingcategory='auto';
        this.router.navigate([`/booking/${val.propertyGroupID}`, detailsRequest]);
  }

  deletePlace(index : number){
    console.log("data from delete", index)

    this.placesService.cartPropertyGroup.splice(index,1);

    localStorage.removeItem('booked[index]' );
    localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));

    this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
  }

  signOut() {

   this.authenticationService.logout();
  }


}
