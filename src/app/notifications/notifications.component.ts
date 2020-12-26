import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

  constructor(private popover:PopoverController) { }

  ngOnInit() {}

  close(){
    this.popover.dismiss();

  }




}
