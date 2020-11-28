import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../model/cart/cart.model';
import { ApiResponse } from '../model/apiresponse.model';
import { apiRoutes } from './routes/apiroutes';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) {
  }

  addCart(cart: Cart[]): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(apiRoutes.cart.addCart, cart);
  }

  deleteCart(cartId: number): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${apiRoutes.cart.deleteCart}?cartID=${cartId}`,null);
  }

  deleteAllCart(cartRequest:any): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${apiRoutes.cart.deleteAllCartDetails}`,cartRequest);
  }

  getCartDetails(): Observable<ApiResponse<Cart[]>> {
    return this.http.get<ApiResponse<Cart[]>>(`${apiRoutes.cart.getCartDetails}`);
  }

  

}
