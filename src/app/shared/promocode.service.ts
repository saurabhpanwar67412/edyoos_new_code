import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { apiRoutes } from 'src/app/shared/routes/apiroutes';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { PromocodeRequest } from 'src/app/model/cart/promocode_request.model';


@Injectable({
  providedIn: 'root'
})
export class PromocodeService {

  constructor(private http: HttpClient) {
  }

  getPromoCodeDiscountPercent(promocode:any){
    return this.http.post<ApiResponse<any>>(`${apiRoutes.PromoCode.GetPromoCodeDiscountPercent}?promocode=${promocode}`, null);
  }

}
