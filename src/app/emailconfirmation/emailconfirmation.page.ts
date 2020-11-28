import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { EmailConfirm } from 'src/app/model/emailconfirm/emailconfirm.model';
import { RegisterService } from '../shared/authentication/register/register.service';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { AlertController  } from '@ionic/angular';

@Component({
  selector: 'app-emailconfirmation',
  templateUrl: './emailconfirmation.page.html',
  styleUrls: ['./emailconfirmation.page.scss'],
})
export class EmailconfirmationPage implements OnInit {

  confirmEmailForm: FormGroup;
  submitted: boolean = false;
  httpError: string;
  emailConfirm: EmailConfirm = new EmailConfirm();
  submitBtnDisable: boolean = false;

  constructor(private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private alertCtrl: AlertController,
    //private placesService: PlacesService,
    private authenticationService: AuthenticationService, 
    //private cartService: CartService,
    private router: Router, 
    private registerService: RegisterService) { }

  ngOnInit() {
    this.confirmEmailForm = this.fb.group({
      password: ['', [Validators.required
      ]]
    });

    this.route.queryParams.subscribe(params => {
      
      this.emailConfirm.Email = params['email'];
      if (params['userid'])
        this.emailConfirm.UserId = params['userid'];
      else if (params['userId'])
        this.emailConfirm.UserId = params['userId'];
      this.emailConfirm.Token = params['token'];
    });
    this.confirmEmailForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.confirmEmailForm);
    })
  }

  formErrors = {
    password: ''
  };

  validationMessages = {
    password: {
      required: 'Password is required.'
    }
  };

  logValidationErrors(group: FormGroup = this.confirmEmailForm): void {
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
      header: 'Email has been confirmed!',
      //subHeader: 'Registration Successful',
      message: message1,
      buttons: [{
        text: 'Ok',
          handler: data => {
            this.router.navigate(['landing/home'])
            this.confirmEmailForm.reset();
          }
      }]
    });
    await alert.present();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.confirmEmailForm.invalid) {
      this.logValidationErrors(this.confirmEmailForm)
    }
    else {
      this.submitBtnDisable = true;
      this.emailConfirm.Password = this.confirmEmailForm.get('password').value;
      this.registerService.EmailConfirmation(this.emailConfirm).subscribe((response: any) => {
        console.log("inside api call of EmailConfirmation::::",this.emailConfirm )
      this.submitBtnDisable = false;
      //his.setlocalStorageAndGetCartDetails(response);
      this.presentAlert('success-message');
      }, 
      (error) => {
        this.submitBtnDisable = false;
        this.httpError = error;
      })

    }
  }


  //http://localhost:8100/emailconfirmation?userId=355&token=CfDJ8JexowKIEzxGi3QLmjg2tmeMZAg3l%2bdLxBtWRaTer%2bhtsMhw24dwhfcbUlg7IiAisOrNrONvMxCZZ%2b5XHE4GPI4MukvJjb7QVR3JIGUUfG5Ps%2fNuWI%2fUgtkYC2yN4jwf09tAwB%2bV%2frNiMYuPpH2rhzCF3Si2mTin8fzF6LfOQPiacl1U9HQ5rmvZwLLLudHSzg%3d%3d&email=ayushgosecur@gmail.com

}
