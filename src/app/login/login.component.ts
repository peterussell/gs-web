import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../core/services/user.service';

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
    this.hasAuthError = false;
    this.isProcessing = true;

    if (this.userService.authenticateUser(this.loginForm.value.email, this.loginForm.value.password)) {
      this.router.navigate(['/courses', 'cpl']);
    } else {
      this.hasAuthError = true;
    }

    this.isProcessing = false;
  }
}
