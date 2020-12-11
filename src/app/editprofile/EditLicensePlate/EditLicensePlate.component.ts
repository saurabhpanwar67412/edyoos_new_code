import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-EditLicensePlate',
  templateUrl: './EditLicensePlate.component.html',
  styleUrls: ['./EditLicensePlate.component.scss']
})
export class EditLicensePlateComponent implements OnInit {
  httpError: any;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditLicensePlateComponent>,
    private dialogService: ConfirmDialogService, @Inject(MAT_DIALOG_DATA) public data: any
    , private userService: UserService, private authenticationService: AuthenticationService

  ) { }
  vehicleForm: FormGroup;

  ngOnInit() {
    this.vehicleForm = this.formBuilder.group({
      vehicleID: [this.data.id],
      'vehicleLicensePlateNumber': [this.data.licensePlateNumber, Validators.required],
      'vehicleMake': [this.data.make, Validators.required],
      'vehicleModel': [this.data.model, Validators.required],
      'userID': ['', ''],
      color: [this.data.color, Validators.required],
      isDefault: [this.data.isDefault, Validators.required]
    });

  }
  cancelVehicle() {
    this.dialogRef.close();
  }
  updateVehicle() {
    const body = this.vehicleForm.value;
    body.userID = this.authenticationService.userValue.id;
    this.userService.savevehicle(body)
      .subscribe((response) => {
        this.dialogRef.close(true);
      }, (error) => {
        this.httpError = error;
      });
  }
  setDefault() {
    let colorControl = this.vehicleForm.get('isDefault');
    colorControl.setValue(!colorControl.value);
    this.vehicleForm.markAsDirty();
  }

}
