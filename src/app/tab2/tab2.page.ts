import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  userId = 0;
  messages=[{reply:"Hi",id:"1"},
  {reply:"Hi",id:"0"},
  {reply:"Wassup",id:"0"},
  {reply:"nothing much",id:"1"}]


  constructor(private router: Router,) {}

  home(){
    this.router.navigate(['/']);
  }

}
