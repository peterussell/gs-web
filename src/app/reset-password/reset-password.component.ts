import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public resetPasswordConfirmForm: FormGroup;
  private hasError: boolean = false;
  private sendCodeErrorMessage: string;
  private resetPasswordErrorMessage: string;
  private currentState: ResetPasswordState = ResetPasswordState.Initial;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email])
    });
    this.resetPasswordConfirmForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormGroup({
        'original': new FormControl(null, Validators.required),
        'confirm': new FormControl(null, Validators.required)
      }),
      'code': new FormControl('', Validators.required)
    });
  }

  onSendResetCode() {
    this.resetPasswordForm.disable();
    this.hasError = false;

    this.userService.sendPasswordResetCode(
      this.resetPasswordForm.get('email').value
    )
    .then(res => {
      this.resetPasswordForm.enable();
      this.currentState = ResetPasswordState.AwaitingConfirmation;
    })
    .catch(err => {
      this.resetPasswordForm.enable();
      this.currentState = ResetPasswordState.SendConfirmationCodeError;
      this.hasError = true;
      this.sendCodeErrorMessage = err.message;
    });
  }

  onResetPassword() {
    this.resetPasswordConfirmForm.disable();
    this.hasError = false;

    this.userService.resetPassword(
      this.resetPasswordConfirmForm.get('email').value,
      this.resetPasswordConfirmForm.get('code').value,
      this.resetPasswordConfirmForm.get('password.original').value
    )
    .then(res => {
      this.resetPasswordConfirmForm.enable();
      this.currentState = ResetPasswordState.ResetSuccess;
    })
    .catch(err => {
      this.resetPasswordConfirmForm.enable();
      this.currentState = ResetPasswordState.ResetPasswordConfirmError;
      this.resetPasswordErrorMessage = err.message;
    });
  }

  showSendCodeForm() {
    return this.currentState === ResetPasswordState.Initial ||
      this.currentState === ResetPasswordState.SendConfirmationCodeError;
  }

  showResetPasswordForm() {
    return this.currentState === ResetPasswordState.AwaitingConfirmation ||
      this.currentState == ResetPasswordState.ResetPasswordConfirmError;
  }

  showSuccessMessage() {
    return this.currentState === ResetPasswordState.ResetSuccess;
  }
}

enum ResetPasswordState {
  Initial,
  AwaitingConfirmation,
  ResetSuccess,
  SendConfirmationCodeError,
  ResetPasswordConfirmError
}