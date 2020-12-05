import { Component, OnInit, NgZone } from '@angular/core';
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
import { CartService } from 'src/app/shared/cart.service';
import { Cart } from 'src/app/model/cart/cart.model';
import jwt_decode from 'jwt-decode';

declare var FB: any;
declare var auth2: any;
declare var AppleID: any;

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
    // FB: any;
    // auth2: any;
    // AppleID: any;

  constructor(private fb: FormBuilder, 
    public router: Router, 
    private loginService: LoginService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute, 
    private placesService: PlacesService,
    private navCtrl: NavController, 
    public alertCtrl: AlertController,
    private cartService: CartService,
    public zone: NgZone) 
    { }

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
        console.log("userLogin.Email::::", userLogin.Email);
        console.log("userLogin.Email::::", userLogin.Email);

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
                        this.router.navigate(['tab3']);
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

getCartDetails() {
    this.cartService.getCartDetails().subscribe((response) => {
        this.placesService.cartPropertyGroup = response.data;
        localStorage.setItem('bookedPlaces', JSON.stringify(this.placesService.cartPropertyGroup));
        // this.placesService.addedCartPropertyGroup.next(this.placesService.cartPropertyGroup);
    }, 
    (error) => {
        console.log(error);
    })
}

setlocalStorageAndGetCartDetails(response) {
    this.authenticationService.setUserValue(response.data);
    let cart: Cart[] = [];
    if (this.placesService.cartPropertyGroup.length > 0) {
        this.placesService.cartPropertyGroup.forEach((val, index) => {
            let cartDetails = new Cart();
            val.PropertyGroupID = cartDetails.PropertyGroupID;
            cart.push(cartDetails);
        });
        this.cartService.addCart(cart).subscribe((response) => {
            console.log("setlocalStorageAndGetCartDetails::::", response.data);
            this.getCartDetails();
            if (this.returnUrl)
                this.router.navigate([this.returnUrl]);
            else {
                this.zone.run(() => {
                    this.router.navigate(['tab1']);
                });
            }
        }, 
        (error) => {
            console.log(error);
        })
    }
    else {
        this.getCartDetails();
        if (this.returnUrl)
            this.router.navigate([this.returnUrl]);
        else {
            this.zone.run(() => {
                this.router.navigate(['tab1']);
            });
        }
    }
}

//GOOGLE LOGIN
loginGmail(){
    auth2.grantOfflineAccess().then((result) => this.signInCallback(result));
}
signInCallback(authResult) {
    var params = {
        Code: authResult.code,
        ReturnUrl: window.location.origin,
        GrantType: "authorization_code"
    }
    this.authenticationService.externalGoogleLogin(params).subscribe((response) => {
        this.setlocalStorageAndGetCartDetails(response);

    }, (error) => {
        console.log(error);
    })
}

//FACEBOOK LOGIN
loginFacebook(){
    FB.login((response) => {
        this.statusChangeCallback(response);
    }, { scope: 'public_profile,email' });
}
externalLogin(accessToken: string) {
    this.authenticationService.externalFacebookLogin(accessToken).subscribe((response) => {
        this.setlocalStorageAndGetCartDetails(response);
    }, 
    (error) => {
        console.log(error);
    })
}
statusChangeCallback(response) {
    if (response.status === 'connected') {
        this.externalLogin(response.authResponse.accessToken);
    }
}

//APPLE LOGIN
async loginApple(){
    try {
        const data = await AppleID.auth.signIn();
        const jsonPayload: any = jwt_decode(data.authorization.id_token);
        let appleRequest = {
            UserId: jsonPayload.sub,
            Email: null,
            FirstName: null,
            LastName: null
        };
        if (data.user) {
            appleRequest.Email = data.user.email;
            appleRequest.FirstName = data.user.name.firstName;
            appleRequest.LastName = data.user.name.lastName;
        }
        this.appleExternalLogin(appleRequest);
    } catch (error) {
        console.log(error);
    }
}
appleExternalLogin(appleRequest) {
    this.authenticationService.appleExternalLogin(appleRequest).subscribe((response) => {
        this.setlocalStorageAndGetCartDetails(response);
    }, 
    (error) => {
        console.log(error);
    })
}

home(){
    this.router.navigate(['/']);
  }


}
