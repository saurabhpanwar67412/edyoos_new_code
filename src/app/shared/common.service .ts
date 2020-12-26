import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../model/cart/cart.model';
import { ApiResponse } from '../model/apiresponse.model';
import { apiRoutes } from './routes/apiroutes';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Make } from '../model/common/make.model';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient, public toastController: ToastController) {
  }

  public SideNavigationBarToggler = true;

  async openSnackBar(message: string, action: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  // openSnackBar(message: string, action: string) {
  //   this._snackBar.open(message, action, {
  //     duration: 5 * 1000
  //   });
  // }
  stringSlicer(str: string, length: number) {
    return str && str.length > length
      ? `${str.slice(0, length)}..` : str;
  }

  getAllMakes(){
    return this.http.get<ApiResponse<Make[]>>(`${apiRoutes.common.getAllMakes}`);
  }

  getAllModelsByMake(makeID: number){
    return this.http.get<ApiResponse<Make[]>>(`${apiRoutes.common.getAllModelsByMake}?makeID=${makeID}`);
  }

}
