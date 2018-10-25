import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss']
})
export class AccountDialogComponent implements OnInit {
  currentState: AccountDialogState;
  public accountDialogState = AccountDialogState;

  constructor(
    public dialogRef: MatDialogRef<AccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { initialState: AccountDialogState },
  ) {
    this.currentState = data.initialState;
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  showRegisterForm() {
    this.currentState = AccountDialogState.Register;
  }

  showLoginForm() {
    this.currentState = AccountDialogState.Login;
  }

  showForgotPasswordForm() {
    this.currentState = AccountDialogState.ResetPassword;
  }
}

export enum AccountDialogState {
  Register,
  Login,
  ResetPassword
}
