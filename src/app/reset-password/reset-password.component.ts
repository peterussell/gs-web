import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup
  private currentState: ResetPasswordState = ResetPasswordState.Initial;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email])
    });
  }

  onResetPassword() {
    if (this.userService.resetPassword(this.resetPasswordForm.value.email)) {
      this.currentState = ResetPasswordState.ResetSuccess;
    } else {
      this.currentState = ResetPasswordState.ResetError;
    }
  }

  showResetForm() {
    return this.currentState === ResetPasswordState.Initial ||
      this.currentState === ResetPasswordState.ResetError;
  }
}

enum ResetPasswordState {
  Initial,
  ResetSuccess,
  ResetError
}