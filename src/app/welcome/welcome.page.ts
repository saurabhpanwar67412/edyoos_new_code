import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private route: ActivatedRoute,public router: Router) 
  {
    console.log("inside construcor of wecome page!!!!")
  }

  ngOnInit() {
  }
  
  gologin(){
    this.router.navigate(['login'])
  }

  gosignup(){
    this.router.navigate(['signup'])
  }

}
