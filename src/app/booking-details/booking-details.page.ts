import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.page.html',
  styleUrls: ['./booking-details.page.scss'],
})
export class BookingDetailsPage implements OnInit {

  item:any=[];
  amenities:any=[];
  imageurl: string;
  searchAddress:any;

  //operationaldays:any=[];

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private navCtrl: NavController,
    public toastController: ToastController) 
  { 
    console.log("testing inside booking page");
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.item = JSON.parse(params.special);
        console.log("this.data on booking-details page::",this.item);
      }
      if(params && params.searchAddress){
        console.log("going here balle=",JSON.parse(params.searchAddress))
        this.searchAddress = JSON.parse(params.searchAddress);
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
    // this.storage.set('booked', this.item);
    let navigationExtras: any = {
      queryParams: {
        special: JSON.stringify(selectparkingdetails),
        searchAddress:JSON.stringify(this.searchAddress)
      }
    };
    console.log("Booking Details navigationExtras=",navigationExtras);
    // this.navCtrl.navigateForward('booking', this.searchobject);
    this.router.navigate(['booking'],navigationExtras );
}

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your item has been added to bag!',
      duration: 2000,
      //css-class: toast-container,
      position: 'top'
    });
    toast.present();
  }

  back(){
    this.navCtrl.back();
  }

}
