import {environment} from '../../../environments/environment';

export const apiRoutes={
   search:{
      getSearchResultForAuto:`${environment.basePath}/Search/GetSearchResultforAuto`,
      GetSearchResultforSeaPlanes:`${environment.apiURL}/Search/GetSearchResultforSeaPlanes`,
      GetSearchResultforBoats:`${environment.apiURL}/Search/GetSearchResultforBoats`,
      GetSearchResultforHelicopter:`${environment.apiURL}/Search/GetSearchResultforHelicopter`,
      GetSearchResultforAirPort:`${environment.apiURL}/Search/GetSearchResultforAirPort`,
      GetSearchResultforSemiTruck: `${environment.apiURL}/Search/GetSearchResultforSemiTruck`,
      GetSearchResultforTruckAndTrailer: `${environment.apiURL}/Search/GetSearchResultforTruckAndTrailer`
   },
   detail:{
      GetPropertyGroupDetail:`${environment.apiURL}/PropertyGroupDetails/GetPropertyGroupDetail`
   },
   register:{
      userRegister:`${environment.apiURL}/Account/RegisterUser`,
      emailConfirm:`${environment.apiURL}/Account/ConfirmEmail`,
   },
   login:{
      userLogin:`${environment.apiURL}/Account/LoginUser`,
      forgetPassword:`${environment.apiURL}/Account/ForgotPassword`,
      resetPassword:`${environment.apiURL}/Account/ResetPassword`,
      changePassword:`${environment.apiURL}/Account/ChangePassword`,
      sendCustomerFeedBackMail:`${environment.apiURL}/Common/SendCustomerFeedBackMail`,
      externalFacebookLogin:`${environment.apiURL}/Account/ExternalFacebookLogin`,
      externalGoogleLogin:`${environment.apiURL}/Account/ExternalGoogleLogin`,
      appleExternalLogin:`${environment.apiURL}/Account/LoginWithApple`
   },
   cart:{
      addCart:`${environment.apiURL}/AddToCart/AddCart`,
      deleteCart:`${environment.apiURL}/AddToCart/DeleteCart`,
      deleteAllCartDetails:`${environment.apiURL}/AddToCart/DeleteAllCartDetails`,
      getCartDetails:`${environment.apiURL}/AddToCart/GetAllCartDetails`
   },
   payment:{
      // second api to call after email and account value get .
      createPaymentIntent:`${environment.apiURL}/PaymentGateWay/create-payment-intent`,
      //  api to get the saved card details of that particular logged in user
      GetPaymentMethodsById:`${environment.apiURL}/PaymentGateWay/GetPaymentMethodsById`,
      // for loggined and has card customer
      chargeCustomerByPaymentId:`${environment.apiURL}/PaymentGateWay/ChargeCustomer`,
      cardSetup:`${environment.apiURL}/PaymentGateWay/card-setup`,
      // third api to call 
      saveCard:`${environment.apiURL}/PaymentGateWay/save_card`,
      updatePaymentDetails:`${environment.apiURL}/PaymentGateWay/update_paymentMethod`,
      refundPayment:`${environment.apiURL}/PaymentGateWay/refund_payment`,
      // first api key to get the publisblekey 
      getPublishableKey:`${environment.apiURL}/PaymentGateWay/get-publishable-key`
   },

   booking:{
      // first api to call after payment
      addBookingDetails:`${environment.apiURL}/booking/AddBookingPaymentDetails`,
      getallBookingById:`${environment.apiURL}/Booking/GetBookingDetails`,
       deletePaymentCardDetails: `${environment.apiURL}/Booking/DeletePaymentCardDetails`,
       CheckForAvaliableSpots: `${environment.apiURL}/Booking/CheckForAvaliableSpots`,
       SpotAvalibilityCheckonCheckOut:`${environment.apiURL}/Booking/SpotAvalibilityCheckonCheckOut`,
       getOrderDetailsById: `${environment.apiURL}/Booking/GetBookingDetailsByBookingID`,
   },
   userprofile:
   {
      updateUserProfileDetails: `${environment.apiURL}/UserDetailsProfile/UpdateUserProfileDetails`,
      getuserprofile: `${environment.apiURL}/UserDetailsProfile/GetUserProfileDetails`,
      addvehciledetails: `${environment.apiURL}/UserDetailsProfile/AddOrUpdateVehicleDetails`,
      getVehicleDetails: `${environment.apiURL}/UserDetailsProfile/GetVehicleDetailsAsync`,
      deleteVehicleDetails: `${environment.apiURL}/UserDetailsProfile/DeleteVehicleDetailsAsync`
   },
   PromoCode:{
      GetPromoCodeDiscountPercent:`${environment.apiURL}/PromoCode/GetPromoCodeDiscountPercent`
   }
}
