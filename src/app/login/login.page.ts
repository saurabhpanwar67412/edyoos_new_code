import { Component, OnInit } from '@angular/core';
import { LoginService } from '../shared/authentication/login/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLogin } from 'src/app/model/login/login.model';
import { ForgetPassword } from 'src/app/model/login/forget_password.model';
import { ApiResponse } from 'src/app/model/apiresponse.model';
// import { CookieService } from 'ngx-cookie-service';
import { ErrorModel } from 'src/app/model/login/error.model';
import { Router, ActivatedRoute } from '@angular/router';
// import swal from 'sweetalert2';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { User } from 'src/app/model/login/user.model';
import { CustomValidators } from 'src/app/helper/custom-validators';
import { environment } from 'src/environments/environment';
import { PlacesService } from 'src/app/shared/places.service';
import {NavController, AlertController} from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
    loginForm: FormGroup;
    submitBtnDisable = false;
    googleProviderUrl: string = `${environment.apiURL}/Account/ExternalLogin?provider=google&returnUrl=${window.location.origin}`;
    httpError: any;
    returnUrl: string;
    passwordType: string = 'password';
    passwordIcon: string = 'eye-off';
   

  constructor(private fb: FormBuilder, public router: Router, private loginService: LoginService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute, private placesService: PlacesService,
    private navCtrl: NavController, public alertCtrl: AlertController) { }

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
        this.returnUrl = params['returnurl'];
        if (this.returnUrl) {
            this.returnUrl = this.returnUrl.slice(this.returnUrl.indexOf('/') + 1, this.returnUrl.length);
        }

    });
    // let email = atob(this.cookieService.get('secure_data1'));
    // let password = atob(this.cookieService.get('secure_data2'));
    let rememberMe: boolean = false;
    // if (email && password) {
    //     rememberMe = true;
    // }
    this.loginForm = this.fb.group({
        email: [null,[Validators.required,
        // Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")
        Validators.email
        ]],
        password: [null, Validators.required],
        rememberMe: [rememberMe]
    });
    this.loginForm.valueChanges.subscribe((data) => {
        this.logValidationErrors(this.loginForm);
    })
    this.loginForm.reset();
}

public get getPasswordControl() {
    return this.loginForm.get('password');
}

formErrors = {
    email: '',
    password: '',
};
validationMessages = {
    email: {
        required: 'Email is required!',
        email: 'Enter a valid email address!'
    },
    password: {
        required: 'Password is required!'

    }
};

logValidationErrors(group: FormGroup = this.loginForm): void {
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

async presentAlert(message1) {
    const alert = await this.alertCtrl.create({
      //header: 'Registration Successful',
      //subHeader: 'Registration Successful',
      message: message1,
      buttons: [{
        text: 'Ok',
          handler: data => {
            //this.submitBtnClicked = false;
            //this.router.navigate(['login'])
            this.loginForm.reset();
          }
      }]
    });
    await alert.present();
  }


onSubmit(): void {
  console.log("on submit calling");
    if (this.loginForm.invalid) {
        this.logValidationErrors(this.loginForm)
    }
    else {
        let userLogin = new UserLogin();
        userLogin.Email = this.loginForm.get('email').value;
        userLogin.Password = this.loginForm.get('password').value;
        this.submitBtnDisable = true;
        let userData: any = {};
        this.loginService.userLogin(userLogin).subscribe((response: ApiResponse<User>) => {
            if (response.data) {
              userData = response.data;
              console.log("login data response=",userData);
                this.submitBtnDisable = false;
                this.httpError = null;
                let rememberMe: boolean = this.loginForm.get('rememberMe').value;
                if (rememberMe) {
                    // this.cookieService.set('secure_data1', btoa(userLogin.Email));
                    // this.cookieService.set('secure_data2', btoa(userLogin.Password));
                }
                else {
                    // this.cookieService.delete('secure_data1');
                    // this.cookieService.delete('secure_data2');
                }
                if (!this.authenticationService.isAuthorized()) { 
                    this.authenticationService.setUserValue(response.data);
                    localStorage.setItem('userData', userData);
                    this.router.navigate(['/profile'],userData);

                    // let cart: Cart[] = [];
                    // if (this.placesService.cartPropertyGroup.length > 0) {
                    //     this.placesService.cartPropertyGroup.forEach((val, index) => {
                    //         let cartDetails = new Cart();
                    //         val.PropertyGroupID = cartDetails.PropertyGroupID;
                    //         cart.push(cartDetails);
                    //     });
                    // //     this.cartService.addCart(cart).subscribe((response) => {
                    // //         console.log(response.data);
                    // //         this.getCartDetails();
                    //         if (this.returnUrl)
                    //             this.router.navigate([this.returnUrl]);
                    //         else
                    //             this.router.navigate(['user/dashboard/myorders']);
                    //     }, (error) => {
                    //         console.log(error);
                    //     })
                    }
                    else {
                        // this.getCartDetails();
                        if (this.returnUrl)
                            this.router.navigate([this.returnUrl]);
                        else
                            // this.router.navigate(['user/dashboard/myorders']);
                            console.log("userDatauserData:;", userData)
                            localStorage.setItem('userData', userData);
                            this.router.navigate(['/profile'],userData);
                    }
                }
                else {
                    this.authenticationService.setUserValue(response.data);
                    // this.getCartDetails();
                    if (this.returnUrl)
                        this.router.navigate([this.returnUrl]);
                    else
                        this.router.navigate(['user/dashboard/myorders']);
                }
            }
        , (error) => {
            this.submitBtnDisable = false;
            if (error == 'Password has expired') {
                this.presentAlert(error);
            }
            this.httpError = error;

        })
    }
}


goforgetpassword(){
  this.router.navigate(['forget-password'])
}

goRegister(){
  this.router.navigate(['signup'])
}

hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
goback(){
    console.log("function called");
    this.navCtrl.back();
    
}

}
