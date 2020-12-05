import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RegisterService } from '../shared/authentication/register/register.service';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { UserRegister } from 'src/app/model/register/register.model';

import { ErrorModel } from 'src/app/model/login/error.model';
import { CustomValidators } from 'src/app/helper/custom-validators';
//import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AlertController  } from '@ionic/angular';
import {environment} from '../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  registerForm: FormGroup;
  httpError: any;
  googleProviderUrl: string = `${environment.apiURL}/Account/ExternalLogin?provider=google&returnUrl=${window.location.origin}`;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  passwordConfirmType: string = 'password';
  passwordConfirmIcon: string = 'eye-off';
  submitBtnClicked: boolean = false;

  constructor(private fb: FormBuilder,
    public router: Router, 
    private registerService: RegisterService,
    private alertCtrl: AlertController) {
      //this.registerForm.reset();

     }

  ngOnInit() {
    
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required,Validators.email
        //  Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")
        ]],
      passwordGroup: this.fb.group({
        password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true
            }),
            // check whether the entered password has upper case letter
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            // check whether the entered password has a lower case letter
            CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true
            }),
            // check whether the entered password has a special character
            CustomValidators.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true
              }
            ),
            Validators.minLength(8)
          ])
        ],
        passwordConfirmation: ['', Validators.required]
      }, { validator: CustomValidators.matchPassword }),
      // iAgree: [false, Validators.requiredTrue],
      // subscribeNewsLetter: [false]

    });

    this.registerForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.registerForm);
    })

  }

  formErrors = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    passwordGroup: '',
    //iAgree: '',
    //subscribeNewsLetter: ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    firstName: {
      required: 'Full Name is required.',
      minlength: 'Full Name must be greater than 2 characters.',
      maxlength: 'Full Name must be less than 20 characters.'
    },
    lastName: {
      required: 'LastName is required.',
      maxlength: 'Last Name must be less than 20 characters.'
    },
    email: {
      required: 'Email is required!',
      email: 'Enter a valid email address!'
    },
    password: {
      required: "Password is required",
      minlength: "Must be at least 8 characters!",
      hasNumber: "Must contain at least 1 number!",
      hasCapitalCase: "Must contain at least 1 in Capital Case!",
      hasSmallCase: "Must contain at least 1 Letter in Small Case!",
      hasSpecialCharacters:"Must contain at least 1 Special Character!"
    },
    passwordConfirmation: {
      required: 'Confirm Password  is required.',
      passwordMismatch: 'Password and Confirm Password do not match.'
    },
    passwordGroup: {
      passwordMismatch: 'Password and Confirm Password do not match.'
    },
    iAgree: {
      required: 'I Agree is required.'
    },
    subscribeNewsLetter: {
      required: 'Subscribe to news letter is required.'
    }
  };


  logValidationErrors(group: FormGroup = this.registerForm): void {
    //console.log("inside logValidationErrors!!")
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      if (abstractControl && !abstractControl.valid) {
        //console.log("inside first if of logValidationErrors!!")
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            if(this.formErrors[key]=='')
            this.formErrors[key] += messages[errorKey] + ' ';
            //console.log("inside inside inside inside logValidationErrors!!")

          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        //console.log("inside second if of logValidationErrors!!")
        this.logValidationErrors(abstractControl);
      }
    });
  }

  public get getPasswordControl() {
    return this.registerForm.get('passwordGroup').get('password');
  }

  showSwal(text) {
    //
  }
  async presentAlert1(message1) {
    const alert = await this.alertCtrl.create({
      header: 'Registration Successful',
      //subHeader: 'Registration Successful',
      message: message1,
      buttons: [{
        text: 'Ok',
          handler: data => {
            // this.registerForm.reset();
            // this.submitBtnClicked = false;
            this.router.navigate(['login'])
            this.registerForm.reset();
          }
      }]
    });
    await alert.present();
  }
  async presentAlert2(message1) {
    const alert = await this.alertCtrl.create({
      header: 'Registration UnSuccessful',
      //subHeader: 'Registration Successful',
      message: message1,
      buttons: [{
        text: 'Ok',
          handler: data => {
            this.registerForm.reset();
          }
      }]
    });
    await alert.present();
  }


  onSubmit(): void {
    console.log("calling registration submit!!!", this.registerForm);
    console.log("registerForm isValid!! ",this.registerForm.invalid);
    if (this.registerForm.invalid) {
      this.logValidationErrors(this.registerForm)
    }
    else {
      this.submitBtnClicked = true;
      console.log("inside onsubit else function !!!")
      let registerUser = new UserRegister();
      registerUser.FirstName = this.registerForm.get('firstName').value;
      registerUser.LastName = this.registerForm.get('lastName').value;
      registerUser.Email = this.registerForm.get('email').value;
      registerUser.Password = this.registerForm.get('passwordGroup').get('password').value;
      // registerUser.SubscribeToNewsLetter = this.registerForm.get('subscribeNewsLetter').value;
      // registerUser.IAgree = this.registerForm.get('iAgree').value;
      registerUser.ReturnUrl = `${window.location.origin}/emailconfirmation`;
      registerUser.FromClient = true;
      console.log("registerUser obj======",registerUser);
      this.registerService.RegisterUser(registerUser).subscribe((response: ApiResponse<string>) => {
      console.log("response response ::::",response )
        if (response.data) {
         console.log("signup response=",response.data);
          this.presentAlert1(response.data);
        }
        else {
          this.presentAlert2(response.errors);
          console.log("inside else")
          console.log(" response.errors response.errors:::",  response.errors)
          console.log(" response.errors[0].message:::",  response.errors[0].message)
          this.httpError = response.errors;
        }
      }, 
      (error) => {
        this.submitBtnClicked = false;
        this.registerForm.reset();

        console.log("inside error")
        console.log(" response.errors:::",  error.errors)
        //console.log(" response.errors[0].message:::",  error.errors.message)
        //this.presentAlert2(error.errors.message);
        this.httpError = error.errors;
      });
    }

  }
  home(){
    this.router.navigate(['/']);
  }

  goLogin(){
    this.router.navigate(['login'])
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  hideShowConfirmPassword() {
  this.passwordConfirmType = this.passwordConfirmType === 'text' ? 'password' : 'text';
  this.passwordConfirmIcon = this.passwordConfirmIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

}
