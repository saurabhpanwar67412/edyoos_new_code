import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  loggedIn = false;
  dark = false;
  //rootPage:any = "";

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
  ) {

    this.initializeApp();
    this.loggedinuser();
  }

  loggedinuser(){
    if(JSON.parse(localStorage.getItem('edyoosUserDetails'))){
    // let userdetails = JSON.parse(localStorage.getItem('edyoosUserDetails'));
    // let userid = userdetails.id;
    // if(userid){
    //   console.log("I am inside if of logged in appcomponent.ts!!!")
      this.loggedIn=true;
      this.router.navigate(['/'])
     }
    else {
      console.log("I am inside else of logged in appcomponent.ts!!!")
      this.loggedIn=false;
      //this.rootPage = 'WelcomePage';
      this.router.navigate(['/welcome'])
    }
  }

  logout(){
    // console.log("button cliked for logout")
    // localStorage.clear();
    // this.router.navigate(['/'] );
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      setTimeout(()=>{
        document.getElementById("custom-overlay").style.display = "none";
      },4000)
      this.router.navigate(['/']);
    });
  }

}
