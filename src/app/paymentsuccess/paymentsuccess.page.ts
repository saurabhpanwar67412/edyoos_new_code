import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-paymentsuccess',
  templateUrl: './paymentsuccess.page.html',
  styleUrls: ['./paymentsuccess.page.scss'],
})
export class PaymentsuccessPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  Home(){
    this.router.navigate([''] );
  }

}
