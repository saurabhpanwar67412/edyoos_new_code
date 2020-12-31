import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { AlertController} from '@ionic/angular';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
  
loggedin : any ;
email:any;
name:any; 

constructor(public router: Router,
  private route: ActivatedRoute,
  private authenticationService: AuthenticationService,
  public alertCtrl: AlertController,
  ){
    let userdetails = JSON.parse(localStorage.getItem('edyoosUserDetails'));
    console.log("inside constructor of profile ppage")
    if(userdetails == null){
      this.loggedin = null
      console.log("this.loggedin value on profile page construtor::", this.loggedin);
    }
    else{
      this.email = userdetails.email;
      this.name= userdetails.firstName + userdetails.lastName;
    }
}

ngOnInit(): void{
  
}

  async presentalert(){
    const alert =  await this.alertCtrl.create({
      //header: 'Registration Successful',
      //subHeader: 'Registration Successful',
      message: 'Are you sure you ant to logout?',
      buttons: [
        {
        text: 'Yes',
        handler: data => {
            this.authenticationService.logout();
            console.log("button cliked for logout")
            localStorage.clear();
            this.router.navigate(['welcome'] );
          }
        },
        {
          text: 'Cancel',
          handler: data => {
            alert.dismiss();
          }
        }
    ]
    });
     await alert.present();
  }

  logout(){
    this.presentalert();
  }

  back(){
    this.router.navigate(['tab1']);
  }

  goto_editprofile(){
    this.router.navigate(['editprofile']);
  }

  goto_payment(){

  }

  goto_settings(){

  }
}
