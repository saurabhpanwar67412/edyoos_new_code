import { Component } from '@angular/core';

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


  constructor() {}

}
