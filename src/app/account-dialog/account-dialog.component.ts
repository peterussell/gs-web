import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss']
})
export class AccountDialogComponent implements OnInit {
  currentState: AccountDialogState;

  constructor(
    public dialogRef: MatDialogRef<AccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { initialState: AccountDialogState },
  ) {
    this.currentState = data.initialState;
  }

  ngOnInit() {
  }

  showRegisterForm() {
    return this.currentState === AccountDialogState.Register;
  }

  showLoginForm() {
    return this.currentState === AccountDialogState.Login;
  }

  showForgotPasswordForm() {
    return this.currentState === AccountDialogState.ForgotPassword;
  }
}

export enum AccountDialogState {
  Register,
  Login,
  ForgotPassword
}
