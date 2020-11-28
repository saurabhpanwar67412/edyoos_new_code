import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetPassword } from 'src/app/model/login/forget_password.model';
//import swal from 'sweetalert2';
import { LoginService } from '../shared/authentication/login/login.service';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { ErrorModel } from 'src/app/model/login/error.model';
import { AlertController  } from '@ionic/angular';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  forgetPasswordForm: FormGroup;
  httpError: any;
  
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,private loginService:LoginService, private alertCtrl: AlertController){

  }

  ngOnInit(): void {
    //this.forgetPasswordForm.reset();

    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required,Validators.email,
        // Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")
      ]]
    });
    this.forgetPasswordForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.forgetPasswordForm);
    })
  }

  formErrors = {
    email: ''
  };

  validationMessages = {
    email: {
      required: 'Email is required!',
      email:'Enter valid email address!'
    }
  };

  async presentAlert1(message1) {
    const alert = await this.alertCtrl.create({
      //header: 'Registration Successful',
      //subHeader: 'Registration Successful',
      message: message1,
      buttons: [{
        text: 'Ok',
          handler: data => {
            // this.registerForm.reset();
            // this.submitBtnClicked = false;
            this.router.navigate(['login'])
            this.forgetPasswordForm.reset();
          }
      }]
    });
    await alert.present();
  }

  logValidationErrors(group: FormGroup = this.forgetPasswordForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }
  submitBtnDisable:boolean=false;

  onSubmit(): void {
    console.log("inside onSubmit()!!!!")
    if (this.forgetPasswordForm.invalid) {
      console.log("inside if of onSubmit1()!!!!")
      this.logValidationErrors(this.forgetPasswordForm)
    }
    else {
      console.log("inside else of onSubmit1()!!!!")
      this.submitBtnDisable=true;
      let forgetPassword=new ForgetPassword();
      forgetPassword.Email=this.forgetPasswordForm.get('email').value;
      forgetPassword.ReturnUrl=`${environment.basePath}/#/pages/resetpassword`;
      console.log("forgetPassword.Email::::", forgetPassword.Email)
      console.log("forgetPassword.ReturnUrl::::", forgetPassword.ReturnUrl)

      this.loginService.forgetPassword(forgetPassword).subscribe((response: ApiResponse<string>) => {
        console.log(" this.loginService.forgetPassword response ::::: ", response )
        if (response.data) { 
          console.log("inside if of response.data!!!!") 
          console.log("response.data::::", response.data)
          this.presentAlert1(response.data);
          //this.showSwal(respsonse.data);
        }
      },
      (error)=>{
        console.log("inside else of response.data!!!!", error)       
        this.submitBtnDisable=false;
        this.httpError=error;
      })     
    }
  }

  gologin(){
    this.router.navigate(['login'])
  }

}
