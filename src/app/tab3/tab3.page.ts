import { Component, OnInit, Inject } from '@angular/core';
import {DASHBOARD_TABS_METADATA} from './tab3_metadata';
import { DashboardService } from 'src/app/shared/dashboard.service';
import * as moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from 'src/app/shared/payment.service';
import { FormControl } from '@angular/forms';
import { RefundRequest } from 'src/app/model/payment/refund_request.model';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { CommonService } from 'src/app/shared/common.service ';
import { ToastController } from '@ionic/angular';
// import { Dialogs } from '@ionic-native/dialogs/ngx';

@Component({
  selector: 'CancelConfirmDialog',
  templateUrl: 'cancel-confirm-dialog.html',
})
export class CancelConfirmDialog {
  reasonControl = new FormControl('');
  constructor(
    public dialogRef: MatDialogRef<CancelConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
}


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {
  DASHBOARD_TABS_METADATA = DASHBOARD_TABS_METADATA
  orders: any[];
  ordersLoaded;
  currentloc: any;
  isOpen = false;
  panelOpenState;
  currentAdd: string;
  data:  any ;
  loggedin : any ; 
  constructor(private dashboardService: DashboardService, public dialog: MatDialog,
    private paymentService: PaymentService, public commonService: CommonService,
    private authenticationService: AuthenticationService, public toastController: ToastController) {}
    
    cancelDialog(order, request, width): void {

      console.log(order,request, width);
      const dialogRef = this.dialog.open(CancelConfirmDialog, {
        width: width,
        data: request,
        minHeight: '180px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.confirm) {
            this.cancelDialog(order, { confirmDialog: false, submitDialog: true, }, '400px');
          }
          else if (result.submit) {
            this.raiseRefundRequest(result.reason, order);
          }
        }
  
      });
    }
  
    raiseRefundRequest(reason: string, order: any) {
  
      order.cancelBtnClick = true;
      let refundRequest = new RefundRequest();
      refundRequest.PaymentIntentId = order.paymentIntentID;
      refundRequest.PropertyGroupName = order.parkingPlace;
      refundRequest.PropertyGroupAmount = order.propertyGroupTotalAmount;
      refundRequest.TrackPropertyGroupID = order.trackPropertyGroupID;
      refundRequest.CancelDate = new Date();
      refundRequest.CancelReason = reason;
      refundRequest.IsBookingCancelled = true;
  
      this.paymentService.raiseRefundRequest(refundRequest)
        .subscribe((response) => {
  
          let showMessage = 'Refund has been initiated';
          let userdetails = this.authenticationService.userValue;
          this.getOrderById(userdetails.id, showMessage, order);
          // order.cancelBtnClick=false;
  
        }, (error) => {
          console.log(error);
          order.cancelBtnClick = false;
          this.presentToast(error);
        })
    }
  


    async presentToast(message: string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000
      });
      toast.present();
    }
  
    ngOnInit(): void {
      this.currentloc = localStorage.getItem("latandlong");
      this.currentAdd = localStorage.getItem("currentAddress") == null ? "My+Location" : localStorage.getItem("currentAddress");
      let userdetails = JSON.parse(localStorage.getItem('edyoosUserDetails'));
      console.log("userdetails inside constructor:::", userdetails)
      if(userdetails == null){
        this.loggedin = null
        console.log("this.logged in value", this.loggedin);
      }
      else{
        console.log("logined in else");
        this.loggedin = userdetails.id;
        
      }
    
      if(userdetails  ){
        console.log("i am true if ")
      this.getOrderById(userdetails.id, null);
    }
   else {
  console.log("   i am called else");
     this.orders= null;

    }
    }
  
    getOrderById(userId, showMessage, order = null) {
      this.dashboardService.getOrderById(userId).subscribe((response) => {
        this.orders = response.data;
        console.log(this.orders);
        
        if (this.orders.length > 0) {
  
          for (let i = 0; i < this.orders.length; i++) {
            this.orders[i].fromDate = moment(this.orders[i].fromDate).format('MMM D,YYYY hh:mm A');
            this.orders[i].toDate = moment(this.orders[i].toDate).format('MMM D,YYYY hh:mm A');
            this.compareDate(this.orders[i]);
          }
  
          if (showMessage) {
           this.presentToast(showMessage);
          }
          if (order) {
            order.cancelBtnClick = false;
          }
        }
  
      }, (error) => {
        if (order) {
          order.cancelBtnClick = false;
        }
        this.presentToast(error);
      });
    }
    cancelInterval: any;
    setIntervalTimeOut() {
      this.cancelInterval = setInterval(() => {
        if (this.orders && this.orders.length > 0) {
          this.orders.forEach((order) => {
            this.compareDate(order);
          });
        }
  
      }, 1000);
    }
  
    ngOnDestroy() {
      if (this.cancelInterval) {
        clearInterval(this.cancelInterval);
      }
    }
  
    compareDate(order) {
      let currentDate = new Date();
      let fromDate = new Date(new Date(order.fromDate).getTime());
  
      fromDate.setHours(new Date(fromDate).getHours() - 1);
  
      if (order.isBookingCancelled) {
        order.showCancel = false;
      }
      else if (moment(currentDate).isSameOrBefore(fromDate)) {
        order.showCancel = true;
      }
      else {
        order.showCancel = false;
      }
    }
  
  
    getImage(order: any): string {
      return order && order.files && order.files[0] && order.files[0].filePath ? order.files[0].filePath : '';
    }
  
}
