import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../shared/authentication/authentication.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
  
loggedin : any ;
email:any;

constructor(public router: Router,
  private route: ActivatedRoute,
  private authenticationService: AuthenticationService
  ){
    let userdetails = JSON.parse(localStorage.getItem('edyoosUserDetails'));
    console.log("inside constructor of profile ppage")
    if(userdetails == null){
      this.loggedin = null
      console.log("this.loggedin value on profile page construtor::", this.loggedin);
    }
    else{
      this.email = userdetails.email;
    }
}

ngOnInit(): void{
  
}

  logout(){
    this.authenticationService.logout();
    console.log("button cliked for logout")
    localStorage.clear();
    this.router.navigate(['welcome'] );
  }
  home(){
    this.router.navigate(['home']);
  }

  goto_editprofile(){
    this.router.navigate(['editprofile']);
  }

  goto_payment(){

  }

  goto_settings(){

  }
}
