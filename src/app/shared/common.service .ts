import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../model/cart/cart.model';
import { ApiResponse } from '../model/apiresponse.model';
import { apiRoutes } from './routes/apiroutes';
// import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient, ) {
  }

  public SideNavigationBarToggler = true;

  openSnackBar(message: string, action: string) {
    // this._snackBar.open(message, action, {
    //   duration: 5 * 1000
    // });
  }
  stringSlicer(str: string, length: number) {
    return str && str.length > length
      ? `${str.slice(0, length)}..` : str;
  }

}
