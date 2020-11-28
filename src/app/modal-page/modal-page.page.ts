import { Component, OnInit,Input  } from '@angular/core';
import {NavParams } from '@ionic/angular';
import { ModalController  } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {MybagPage} from '../mybag/mybag.page';


@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit {

  navdata : any ;
item : any =[];
  constructor(public modalctrl : ModalController ,public navParams: NavParams,
    private router: Router,private storage: Storage
    ) {
     this.item = this.navParams.get('message')  ;
 
  
    console.log('ionViewDidLoad ModalPage');
  
    console.log("this data", this.item);
   }

  ngOnInit() {
  }
  public closeModal(){
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalctrl.dismiss({
      'dismissed': true
    });

  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  addtobag(){
    console.log("data added to storage");
    this.storage.set('booked', this.item);
    this.modalctrl.dismiss({
      'dismissed': true
    });
    this.router.navigate(['mybag'] );

  }

  Reservenow(){

    console.log("reserve now button clicked");

    let navigationExtras: any = {
      queryParams: {
        special: JSON.stringify(this.item)
      }
    };
    this.modalctrl.dismiss({
      'dismissed': true
    });
    // this.navCtrl.navigateForward('booking', this.searchobject);
    this.router.navigate(['booking'],navigationExtras );
  }

}
