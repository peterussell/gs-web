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
  public hasAuthError: boolean = false;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }

  onLogin() {
    this.loginForm.disable();
    this.hasAuthError = false;

    this.userService.authenticateUser(
      this.loginForm.get('email').value,
      this.loginForm.get('password').value
    )
    .then(res => this.router.navigate(['/courses', 'cpl']))
    .catch(err => {
      this.loginForm.enable();
      this.hasAuthError = true;
    })
  }
}
