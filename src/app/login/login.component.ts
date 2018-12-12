import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../core/services/user.service';
import { AuthenticateUserResultStatus } from '../core/services/authenticate-user.result';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { map, catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() onAuthenticationSuccess = new EventEmitter<any>();
  @Output() onShowForgotPasswordForm = new EventEmitter<any>();
  @Output() onShowRegisterForm = new EventEmitter<any>();

  public loginForm: FormGroup;
  public hasAuthError: boolean = false;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }

  onLogin() {
    this.hasAuthError = false;
    this.loginForm.disable();

    this.userService.signIn(
      this.loginForm.get('email').value,
      this.loginForm.get('password').value
    )
    .subscribe(
      (cognitoUser: CognitoUser) => {
        this.userService.setCurrentUser(cognitoUser);
        this.onAuthenticationSuccess.emit();
      },
      (error: any) => {
        this.hasAuthError = true;
        this.loginForm.enable();
      }
    );
  }

  showRegisterForm() {
    this.onShowRegisterForm.emit();
  }

  showForgotPasswordForm() {
    this.onShowForgotPasswordForm.emit();
  }
}
