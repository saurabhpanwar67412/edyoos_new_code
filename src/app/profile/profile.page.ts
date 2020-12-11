import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
 
constructor(public router: Router,
  private route: ActivatedRoute
  ){

}

ngOnInit(): void{
  
}

  goto_editprofile(){
    this.router.navigate(['editprofile']);
  }


}
