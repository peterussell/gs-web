import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../core/services/user.service';
import { AuthenticateUserResultStatus } from '../core/services/authenticate-user.result';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isProcessing: boolean = false;
  public hasAuthError: boolean = false;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }

  onLogin() {
    this.startProcessing();
    this.hasAuthError = false;

    const authResult = this.userService.authenticateUser(
      this.loginForm.value.email, this.loginForm.value.password
    );
    
    if (authResult.status === AuthenticateUserResultStatus.Success) {
      this.router.navigate(['/courses', 'cpl']);
    } else {
      this.hasAuthError = true;
    }
    this.isProcessing = false;
  }

  startProcessing() {
    this.isProcessing = true;
  }

  stopProcessing() {
    this.isProcessing = false;
  }
}
