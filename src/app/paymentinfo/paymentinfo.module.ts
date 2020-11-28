import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PaymentinfoPageRoutingModule } from './paymentinfo-routing.module';

import { PaymentinfoPage } from './paymentinfo.page';

import { PromocodeService } from 'src/app/shared/promocode.service';
import { PromocodeEnum } from 'src/app/shared/enum/prmocode_enum';
import { PlacesService } from 'src/app/shared/places.service';
import { Router, ActivatedRoute } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentinfoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PaymentinfoPage],
})
export class PaymentinfoPageModule {
  promoToggler = false;
  promoCodeDiscountPercentage: number = 0;
  promoCodeDiscountAmount: number;
  inValidPromoCodeMessage: string;
  promoCodeId: number;
  promoCodeType: number;
  promoCode: string;
  promocode: string;
  disCountApplied: boolean = false;

  constructor(
    private promocodeService: PromocodeService,
    private placesService: PlacesService,
    private router: Router
    ) 
    {
      // if (this.placesService.cartPropertyGroup.length == 0) {
      //   this.router.navigate(['/landing']);
      // }
    }
   
    

  
    getPromoCodeDiscountPercent(promocode: string) {
  alert("inside function")
    this.inValidPromoCodeMessage = null;
    // this.promoCode = promocode;
    this.promocodeService.getPromoCodeDiscountPercent(promocode).subscribe((response) => {
      console.log("inside function getpromocode:::::", response.data);

    

    //   if (PromocodeEnum.Edyoos == response.data.promoCodeType || PromocodeEnum.FirstTimeUser == response.data.promoCodeType) {

    //     this.placesService.cartPropertyGroup.forEach((value, index) => {

    //       this.placesService.cartPropertyGroup[index].checkoutAmount =
    //         this.placesService.cartPropertyGroup[index].calculatedAmount * (<number>response.data.discountedPrice / 100);
    //       this.placesService.cartPropertyGroup[index].checkoutAmount = this.placesService.cartPropertyGroup[index].calculatedAmount -
    //         this.placesService.cartPropertyGroup[index].checkoutAmount;
    //       this.placesService.cartPropertyGroup[index].discountedPrice = <number>response.data.discountedPrice;
    //     });
    //     this.placesService.promocodeDiscountPercentage.next(0);
    //     this.promoCodeDiscountPercentage = 0;
    //     this.disCountApplied = true;
    //     this.promoCodeId = response.data.promoCodeID;
    //     this.promoCodeType = response.data.promoCodeType;
    //     this.promoCode = promocode;
    //     // this.placesService.promocodeDiscountPercentage.next(<number>response.data.discountedPrice);
    //     // this.promoCodeDiscountPercentage = <number>response.data.discountedPrice;
    //     // this.getTotalAmount();

    //   }
    //   else if (
    //     PromocodeEnum.Company == response.data.promoCodeType || PromocodeEnum.Others == response.data.promoCodeType) {
    //     if (this.checkPromocodeIsThere(response.data.propertyGroupID, (<number>response.data.discountedPrice))) {
    //       this.placesService.promocodeDiscountPercentage.next(0);
    //       this.promoCodeDiscountPercentage = 0;
    //       this.disCountApplied = true;
    //       this.promoCodeId = response.data.promoCodeID;
    //       this.promoCodeType = response.data.promoCodeType;
    //       this.promoCode = promocode;
    //     }

    //     else {
    //       this.inValidPromoCodeMessage = 'Please provide valid promocode';
    //     }
    //   }
    //   else {
    //     this.inValidPromoCodeMessage = 'Please provide valid promocode';
    //   }


    }, (error) => {
      this.inValidPromoCodeMessage = error;
    });
  }

  // checkPromocodeIsThere(propertyGroupID: string, discountedPrice: number): boolean {
  //   let arrayPropertyGroupId = propertyGroupID.split(',');
  //   let ischeck = false;
  //   this.placesService.cartPropertyGroup.forEach((value, index) => {

  //     let found = arrayPropertyGroupId.some(id => id == (<string>value.propertyGroupID));
  //     if (found && !ischeck) {
  //       ischeck = true;
  //       this.placesService.cartPropertyGroup[index].checkoutAmount =
  //         this.placesService.cartPropertyGroup[index].calculatedAmount * (discountedPrice / 100);
  //       this.placesService.cartPropertyGroup[index].checkoutAmount = this.placesService.cartPropertyGroup[index].calculatedAmount -
  //         this.placesService.cartPropertyGroup[index].checkoutAmount;
  //       this.placesService.cartPropertyGroup[index].discountedPrice = discountedPrice;

  //     }
  //   })
  //   return ischeck;

  // }


}
