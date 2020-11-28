import { Component, OnInit, NgZone, Input, ViewChild, ElementRef } from '@angular/core';
import { ProfileService } from 'src/app/shared/profile.service';
import { Change_Password_Metadata, Profile_METADATA, License_Plate_Metadata, emailVaidatorsfor, logValidationErrors, errorMessages } from './profile-page-metadata';
import * as lodash from 'lodash';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { CRUDApiResponseModel } from 'src/app/model/crud_apiresponse.model';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { Meta } from '@angular/platform-browser';
import { GenderEnum } from 'src/app/shared/enum/gender_enum';
import { UserService } from 'src/app/shared/user.service';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import { CustomValidators } from 'src/app/helper/custom-validators';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
//import { ActionSheet } from '@ionic-native/action-sheet/ngx';
import { ActionSheetController } from '@ionic/angular';
import { VechicleRequestModel } from 'src/app/model/cart/booking_request.model';
import { Router, ActivatedRoute } from '@angular/router';
import { EditLicensePlateComponent } from './EditLicensePlate/EditLicensePlate.component';
import { MatDialog } from '@angular/material/dialog';

import { AuthenticationService } from '../shared/authentication/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @Input() tabName;
  //DASHBOARD_TABS_METADATA = DASHBOARD_TABS_METADATA;
  public show = false;
  // imageError: string;
  // isImageSaved: boolean;
  // cardImageBase64: string;
  changePasswordForm: FormGroup;
  vehicleForm: FormGroup;
  imageForm: FormGroup;
  Change_Password_Metadata = Change_Password_Metadata;
  Profile_METADATA = Profile_METADATA;
  License_Plate_Metadata = License_Plate_Metadata;
  passwordChanged;
  profileForm: FormGroup;
  //CountryISO = CountryISO;
  timeZones = [];
  isOpen;
  isInit = true;
  errors = errorMessages;
  httperror1: string;
  httperror2: string;
  httperror3: string;
  vehicledetails: VechicleRequestModel[];
  //private email: string;
  private userid: number;
  //fileToUpload: File = null;
  profileSaved;
  //imagealreadyavailble: string = null;
  public modeselect = 'Male';
  //private taskmenu = Gender_For_Profile;
  public updatebutton = true;
  profileid: any;
  imgData:any;
  base64image:any;
  firstName: any;
  lastName: any;
  email:string;

  @ViewChild('searchBar')
  public searchElementRef: ElementRef;


  constructor(private formBuilder: FormBuilder,
    //private modalService: NgbModal,
    private profileService: ProfileService,
    private userService: UserService,
    public dialog: MatDialog,
    private dialogService: ConfirmDialogService,
    //private commentService: CommonService,
    //protected mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private metaTagService: Meta,
    public actionsheetCtrl: ActionSheetController,
    private camera: Camera,
    private base64: Base64,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService
    ) 
    
    {
      let userdetails = JSON.parse(localStorage.getItem('edyoosUserDetails'));
      //let userdetails = JSON.parse(this.activatedRoute.snapshot.paramMap.get('userData'));
      console.log("userdetails inside constructor:::", userdetails)

      this.userid = userdetails.id;
      this.email = userdetails.email;
      this.firstName = userdetails.firstName;
      this.lastName = userdetails.lastName;
      this.email = userdetails.email;
      this.createImageForm();
      this.imageForms.push(this.createFileGroup());
  
      for (let i = -12; i < 15; i++) {
        if (i > -1) {
          this.timeZones.push('+' + i);
        }
        else {
          this.timeZones.push(i);
        }
      }
     }

    ngOnInit(): void {
      this.tabName = 'settings';
      this.createForms();
      this.createImageForm();
      this.imageForms.push(this.createFileGroup());
     
      this.registerChangePasswordListeners();
      this.changePasswordForm.valueChanges.subscribe((data) => {
        this.logValidationErrors(this.changePasswordForm);
      })
      // this.isOpen = this.commentService.SideNavigationBarToggler;
      // this.metaTagService.updateTag(
      //   { name: 'title', content: 'Log In To Your Edyoos Easy Online Reservations Account' }
      // );
      // this.metaTagService.updateTag(
      //   {
      //     name: 'description', content: 'Manage your parking reservations online. Reserve parking for events, city '+
      //     'parking, airport parking, and more. Track your parking spots in real-time.'
      //   }
      // );
      // this.metaTagService.updateTag(
      //   {
      //     name: 'keywords', content: 'parking, parking reservations, reserved parking, city parking, online parking, event '+
      //     'parking, airport parking'
      //   }
      // );
    }
  
    gender = GenderEnum;
    getGenderArray(): Array<string> {
      var keys = Object.keys(this.gender);
      return keys.slice(keys.length / 2);
    }
  
    attributeDisplay(attribute1, attribute2) {
      if (attribute1.id == attribute2.id) {
        return attribute1.name;
      } else {
        return '';
      }
    }

    createForms() {
      this.changePasswordForm = this.formBuilder.group({
        [Change_Password_Metadata.currentPassword]: ['', Validators.required],
        [Change_Password_Metadata.newPassword]: [null,
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
        [Change_Password_Metadata.confirmPassword]: ['', Validators.required]
      });
 
      this.profileForm = this.formBuilder.group({
        [Profile_METADATA.firstName]: ['', Validators.required],
        [Profile_METADATA.lastName]: ['', Validators.required],
        [Profile_METADATA.gender]: ['', Validators.required],
        [Profile_METADATA.email]: ['', [Validators.required, emailVaidatorsfor.emailVaidator]],
        [Profile_METADATA.phoneNumber]: ['', [Validators.required, Validators.pattern('^[1234567890][0-9]{9}$')]],
        [Profile_METADATA.address1]: ['', Validators.required],
        [Profile_METADATA.address2]: [''],
        [Profile_METADATA.city]: ['', Validators.required],
        [Profile_METADATA.state]: ['', Validators.required],
        [Profile_METADATA.zipCode]: ['', [Validators.required, Validators.max(99999)]],
  
        [Profile_METADATA.apt]: [''],
        [Profile_METADATA.aboutYou]: ['']
      });
  
      this.vehicleForm = this.formBuilder.group({
        [License_Plate_Metadata.vehicleLicensePlateNumber]: ['', Validators.required],
        [License_Plate_Metadata.vehicleMake]: ['', Validators.required],
        [License_Plate_Metadata.vehicleModel]: ['', Validators.required],
        'userID': ['', ''],
        [License_Plate_Metadata.color]: ['', Validators.required],
        isDefault: [false, Validators.required]
      });
  
      this.onPageLoad();
    }

    onPageLoad() {
      this.getVehicleDetails();
      this.getuserprofile();
    }
  
    getuserprofile() {

      this.userService.getuserprofile(this.userid).subscribe((response) => {
        console.log("userid getuserprofile()::::", this.userid)
        console.log(" response inside getuserprofile()::::", response)
        
        this.profileid = response.data[0].userProfileDetailsID;
        this.profileForm.patchValue(response.data[0]);
        this.profileForm.get(Profile_METADATA.address1).setValue(response.data[0].address);
        if (response.data[0].files) {
          //this.imagealreadyavailble = response.data[0].files.filePath;
        }
      },
        (error) => {
          this.httperror1 = error;
        }
      );
    }

    toFormData<T>(formValue: T, formData: FormData) {
      for (const key of Object.keys(formValue)) {
        const value = formValue[key];
        if (value != null && value != '') {
          formData.append(key, value);
        }
      }
      return formData;
    }

    saveProfile() {
      if (this.profileForm.invalid) {
        // this.logValidationErrors();
      }
      else {
        let formData = new FormData();
        let body = this.profileForm.value;
        console.log("inside saveprofile()--> body::", body)
        delete body.phone;
        // body.phoneNumber = this.profileForm.get(Profile_METADATA.phoneNumber).value.number;
        body.userID = this.userid;
        console.log("inside saveprofile()--> this.profileid::::", this.profileid)
        body.UserProfileDetailsID = this.profileid;
        delete body['files'];
        formData = this.toFormData(this.profileForm.value, formData);
        for (let i = 0; i < this.imageForm.get('files').value.length; i++) {
          if (this.imageForm.get('files').value[i].filePath != null) {
            formData.append("files.filePath", this.imageForm.get('files').value[i].filePath)
          }
          // var filePath="files[" + i + "].filePath";
          // datafiles.filePath= this.imageForm.get('files').value[i].filePath;
          if (this.imageForm.get('files').value[i].fileSource != null) {
            formData.append("files.fileSource", this.imageForm.get('files').value[i].fileSource)
          }
  
          if (this.imageForm.get('files').value[i].fileID != null) {
            formData.append('files.fileID', this.imageForm.get('files').value[i].fileID);
          }
          if (this.imageForm.get('files').value[i].fileMappingID != null) {
            formData.append("files.fileMappingID", this.imageForm.get('files').value[i].fileMappingID)
          }
  
          if (this.imageForm.get('files').value[i].fileName != null) {
            formData.append("files.fileName", this.imageForm.get('files').value[i].fileName)
          }
  
          if (this.imageForm.get('files').value[i].fileType != null) {
            formData.append("files.fileType", this.imageForm.get('files').value[i].fileType)
          }
        }
        formData.append('files.UserID', this.userid.toString());
        this.httperror1 = null;
        this.userService.updateProfile(formData).subscribe((response: ApiResponse<CRUDApiResponseModel>) => {
          this.profileForm.reset();
          this.imageForm.reset();
          this.getuserprofile();
          const options = {
            title: 'Updated',
            message: 'Profile Updated Successfully!',
            confirmText: 'OK'
          };
          this.dialogService.open(options);
          this.dialogService.confirmed().subscribe(confirmed => {
            if (confirmed) {
            }
          });
        },
          (error) => {
            this.httperror1 = error;
          }
        );
        // this.profileSaved = true;
      }
    }

    registerChangePasswordListeners() {
      this.changePasswordForm.get(Change_Password_Metadata.confirmPassword).valueChanges.subscribe((value) => {
        const newPasswordValue = this.changePasswordForm.get(Change_Password_Metadata.newPassword).value;
        if (value && value != newPasswordValue) {
          this.changePasswordForm.get(Change_Password_Metadata.confirmPassword).setErrors({ notIdentical: true });
        }
      });
      this.changePasswordForm.get(Change_Password_Metadata.newPassword).valueChanges.subscribe((value) => {
        const confirmPasswordControl = this.changePasswordForm.get(Change_Password_Metadata.confirmPassword);
        if (value && value != confirmPasswordControl.value && confirmPasswordControl.touched) {
          this.changePasswordForm.get(Change_Password_Metadata.confirmPassword).setErrors({ notIdentical: true });
        }
        else if (value && value === confirmPasswordControl.value && confirmPasswordControl.touched && confirmPasswordControl.value) {
          confirmPasswordControl.setErrors([]);
          confirmPasswordControl.updateValueAndValidity();
        }
      });
    }

    updatePassword() {
      const body = this.changePasswordForm.value;
      body.email = this.email;
      this.httperror2 = null;
      this.userService.changePassword(body).subscribe((response: ApiResponse<CRUDApiResponseModel>) => {
        this.changePasswordForm.reset();
        const options = {
          title: 'Updated',
          message: 'Password Updated Successfully!',
          confirmText: 'OK'
        };
        this.dialogService.open(options);
        this.dialogService.confirmed().subscribe(confirmed => {
          if (confirmed) {
          }
        });
      },
        (error) => {
          this.httperror2 = error;
        }
      );
    }

    logValidationErrors(group: FormGroup = this.changePasswordForm): void {
      Object.keys(group.controls).forEach((key: string) => {
        const abstractControl = group.get(key);
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              if (this.formErrors[key] == '')
                this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
        if (abstractControl instanceof FormGroup) {
          this.logValidationErrors(abstractControl);
        }
      });
    };
  
    formErrors = {
      [Change_Password_Metadata.currentPassword]: '',
      [Change_Password_Metadata.newPassword]: '',
      [Change_Password_Metadata.confirmPassword]: ''
    };
  
    // This object contains all the validation messages for this form
    validationMessages = {
      [Change_Password_Metadata.currentPassword]: {
        required: 'Current Password is required'
      },
      [Change_Password_Metadata.newPassword]: {
        required: "New Password is required",
        minlength: "Must be at least 8 characters!",
        hasNumber: "Must contain at least 1 number!",
        hasCapitalCase: "Must contain at least 1 in Capital Case!",
        hasSmallCase: "Must contain at least 1 Letter in Small Case!",
        hasSpecialCharacters: "Must contain at least 1 Special Character!"
      },
      [Change_Password_Metadata.confirmPassword]: {
        required: 'Change Password is required.',
        notIdentical: 'Confirm Password must be Identical to New Password'
      },
    };

    componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    onAutocompleteSelected(value) {
      if (value.address_components) {
        this.profileForm.get(Profile_METADATA.city).setValue(null);
        this.profileForm.get(Profile_METADATA.state).setValue(null);
        this.profileForm.get(Profile_METADATA.zipCode).setValue(null);
        let addressLine1;
        for (var i = 0; i < value.address_components.length; i++) {
          var addressType = value.address_components[i].types[0];
          if (this.componentForm[addressType]) {
            var val = value.address_components[i][this.componentForm[addressType]];
            if (addressType == 'street_number' || addressType == 'route') {
              if (addressLine1) {
                addressLine1 = `${addressLine1} ${val}`;
              }
              else {
                addressLine1 = val;
              }
            }
            else if (addressType == 'locality') {
              this.profileForm.get(Profile_METADATA.city).setValue(val);
            }
            else if (addressType == 'administrative_area_level_1') {
              this.profileForm.get(Profile_METADATA.state).setValue(val);
            }
            else if (addressType == 'postal_code') {
              this.profileForm.get(Profile_METADATA.zipCode).setValue(val);
            }
          }
        }
        this.profileForm.get(Profile_METADATA.address1).setValue(addressLine1);
      }
    }

    createFileGroup() {
      return this.formBuilder.group({
        fileID: [0],
        fileMappingID: [0],
        userID: [0],
        fileName: [null],
        filePath: [null, Validators.required],
        fileType: [null],
        fileLocalPath: [null],
        filePropertyGroupID: [0],
        fileSource: [null, [this.requiredFileType(['png', 'jpg']), this.requiredFileSize(1)]]
      });
    }

    createImageForm() {
      this.imageForm = this.formBuilder.group({
        files: this.formBuilder.array([])
      });
    }

    get imageForms() {
      return this.imageForm.get('files') as FormArray;
    }

    requiredFileType(type: string[]) {
      return function (control: FormControl) {
        const file = control.value;
        if (file) {
          const extension = file.name.split('.')[1].toLowerCase();
          if (!type.some(s => s == extension.toLowerCase())) {
            return {
              requiredFileType: true
            };
          }
          return null;
        }
        return null;
      };
    }

    requiredFileSize(size: number) {
      return function (control: FormControl) {
        const file = control.value;
        if (file) {
          if (file.size / 1024 / 1024 > size) {
            return {
              requiredFileSize: true
            };
          }
          return null;
        }
        return null;
      };
    }

    async profilepicture(){
      const actionSheet = await this.actionsheetCtrl.create({
        header: 'Select File',
        cssClass: 'action-sheets-basic-page',
        buttons: [
        {
          text: 'Open camera',
          icon: 'md-camera',
          handler: () => {
            var options = {
              quality: 50,
              destinationType: this.camera.DestinationType.FILE_URI,
              sourceType: this.camera.PictureSourceType.CAMERA,
              allowEdit: true,
              encodingType: this.camera.EncodingType.JPEG,
              saveToPhotoAlbum: false,
              correctOrientation: true, 
            };
            this.camera.getPicture(options).then((imageData) => {
              this.imgData = imageData;
              this.base64.encodeFile(imageData).then((base64File: string) => { 
                let arr = base64File.split('base64,');
                this.base64image = arr[1];
                this.profileService.SaveProfileImageBase64(this.base64image.replace('data:image/jpeg;base64,', '')).subscribe(() => { });
                //console.log(this.webcamImage.imageAsBase64);
              }, 
              (err) => {});
            });
          }
        },
        {
        text: 'Select from gallery',
        icon: 'md-images',
        handler: () => {
          var options = {
            quality: 50,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: this.camera.EncodingType.JPEG,
            saveToPhotoAlbum: false,
            correctOrientation: true,
          };
          this.camera.getPicture(options).then((imageData) => {
          this.imgData = imageData;
          this.base64.encodeFile(imageData).then((base64File: string) => {   
          let arr = base64File.split('base64,');
            this.base64image = arr[1];
          }, 
          (err) => {
             
          });
          }, 
          (err) => {
          
          });
          }
        }
      ]
      });
      await actionSheet.present();
    }
    
  toggle() {
    this.show = !this.show;
  }

  getVehicleDetails() {
    this.userService.getVehicleDetails(this.userid)
      .subscribe((response) => {
        console.log(response.data);
        this.vehicledetails = response.data;
      }, (error) => {
        console.log(error);
      });
  }
  
  disabledDefault: boolean = false;
  saveSetDefault(vehicleDetails) {
    this.disabledDefault = true;
    let body = {
      VehicleID: vehicleDetails.id,
      VehicleLicensePlateNumber: vehicleDetails.licensePlateNumber,
      VehicleMake: vehicleDetails.make,
      VehicleModel: vehicleDetails.model,
      UserId: vehicleDetails.userID,
      Color: vehicleDetails.color,
      IsDefault: !vehicleDetails.isDefault
    }
    this.userService.savevehicle(body).subscribe((response) => {
      this.disabledDefault = false;
      this.getVehicleDetails();
      const options = {
        title: 'Updated',
        message: 'Vehicle Details Updated Successfully!',
        confirmText: 'OK'
      };
      this.dialogService.open(options);
      this.dialogService.confirmed().subscribe(confirmed => {
      });
    },
      (error) => {
        this.disabledDefault = false;
        this.httperror3 = error;
      }
    );
  }

  savevehicle() {
    const body = this.vehicleForm.value;
    body.userID = this.userid;
    this.userService.savevehicle(body).subscribe((response) => {
      this.vehicleForm.reset();
      this.getVehicleDetails();
      const options = {
        title: 'Updated',
        message: 'Vehicle Details Updated Successfully!',
        confirmText: 'OK'
      };
      this.dialogService.open(options);
      this.dialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this.show = !this.show;
        }
      });
    },
      (error) => {
        this.httperror3 = error;
      }
    );
  }

  deleteVehiclePlate(vehicleID) {
    const options = {
      title: 'Confirmation',
      message: 'Are you sure want to delete this',
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteVehicleDetails(vehicleID)
          .subscribe((response) => {
            this.getVehicleDetails();
            const options = {
              title: 'Updated',
              message: 'Deleted Successfully!',
              confirmText: 'OK'
            };
            this.dialogService.open(options);
            this.dialogService.confirmed().subscribe(confirmed => {
              if (confirmed) {
              }
            });
          }, (error) => {
            this.httperror3 = error;
          })
        // this.createForms();
        this.show = !this.show;
      }
    });
  }

  setDefault() {
    let colorControl = this.vehicleForm.get('isDefault');
    colorControl.setValue(!colorControl.value);
  }
  
   logout(){
            this.authenticationService.logout();
        
            console.log("button cliked for logout")
            localStorage.clear();
            this.router.navigate(['/'] );
          }
 

  editVehiclePlate(vehicleDetails: any) {
    const dialogRef = this.dialog.open(EditLicensePlateComponent, {
      width: '800px',
      data: vehicleDetails,
      minHeight: '180px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getVehicleDetails();
      }
    });
  }

  // geoCoder;
  // initializeAutoComplete() {
  //   this.mapsAPILoader.load().then(() => {
  //     this.geoCoder = new google.maps.Geocoder();
  //     const autocomplete = new google.maps.places.Autocomplete(
  //       this.searchElementRef.nativeElement
  //     );
  //     autocomplete.addListener('place_changed', () => {
  //       this.ngZone.run(() => {
  //         //debugger
  //         const place: google.maps.places.PlaceResult = autocomplete.getPlace();
  //         this.onAutocompleteSelected(place);
  //         console.log(place);
  //       });
  //     });
  //   });
  // }

  
}
