import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthenticateUserResultStatus } from '../../core/services/authenticate-user.result';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { map, catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../../core/models/user.model';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public hasAuthError: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private storeService: StoreService) { }

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
        // Load the user's profile info
        this.userService.getProfile(cognitoUser['username']).subscribe((data) => {
          let user = new User(cognitoUser, data);
          this.userService.setCurrentUser(user);
          this.router.navigate(['/dashboard']);
        });
      },
      (error: any) => {
        this.hasAuthError = true;
        this.loginForm.enable();
      }
    );
  }
}
