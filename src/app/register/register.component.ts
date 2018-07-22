import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public passwordMismatch: boolean;

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormGroup({
        'original': new FormControl(null, Validators.required),
        'confirm': new FormControl(null, Validators.required)
      }),
    });
  }

  checkPasswordsMatch(): boolean {
    const originalControl = this.registerForm.get('password.original');
    const confirmControl = this.registerForm.get('password.confirm');
    this.passwordMismatch =
      originalControl.touched && confirmControl.touched &&
      (originalControl.value !== confirmControl.value);
    return !this.passwordMismatch;
  }

  onRegister() {
    if (!this.checkPasswordsMatch()) {
      return;
    }
    const registerResult = this.userService.registerUser(
      this.registerForm.get('email').value,
      this.registerForm.get('password.original').value
    );
  }
}

enum RegisterUserState {
  Initial,
  Success,
  Error
}
