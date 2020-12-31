import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss'],
})
export class MoreComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
    private router: Router,) { }

  ngOnInit() {}

  gotoprofile(){
    this.router.navigate(['profile']);
  }
}
