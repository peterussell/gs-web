import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../core/services/user.service';
import { RegisterUserResultStatus } from '../core/services/register-user.result';
import { GlobalVariables } from '../../globals';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() onShowLoginForm = new EventEmitter<any>();

  public registerForm: FormGroup;
  public activateForm: FormGroup;
  private currentState: RegisterUserState = RegisterUserState.Initial;
  private errorMessage: string;
  private activateErrorMessage: string; // todo: move to a separate component
  private facebookUrl: string = GlobalVariables.FACEBOOK_URL;

  private readonly _errPasswordMismatch: string = "Password and confirmation don't match, please try again.";

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormGroup({
        'original': new FormControl(null, Validators.required),
        'confirm': new FormControl(null, Validators.required)
      })
    });

    this.activateForm = new FormGroup({
      'email': new FormControl(null, Validators.required),
      'code': new FormControl(null, Validators.required)
    });
  }

  onRegister() {
    this.registerForm.disable();
    this.clearError();

    if (!this.checkPasswordsMatch()) {
      return;
    }
    const registerResult = this.userService.registerUser(
      this.registerForm.get('email').value,
      this.registerForm.get('password.original').value
    )
    .then(res => {
      this.registerForm.enable();
      this.currentState = RegisterUserState.Activate;
    })
    .catch(err => {
      this.registerForm.enable();
      switch (err.code) {
        case "UsernameExistsException":
          this.setError("An account with that email already exists.");
          return;
        case "InvalidPasswordException":
        case "InvalidParameterException":
          this.setError("Password must be at least 6 characters, contain at least " +
                        "one numeric character, and one symbol.")
          return;
      }
      this.setError(err.message);
    })
  }

  onActivate() {
    this.activateForm.disable();
    this.userService.activateUser(
      this.activateForm.get('email').value,
      this.activateForm.get('code').value
    )
    .then(res => {
      this.activateForm.enable();
      this.currentState = RegisterUserState.ActivateSuccess;
    })
    .catch(err => {
      this.activateForm.enable();
      this.setActivateError(err.message);
      this.currentState = RegisterUserState.Activate
    });
  }

  checkPasswordsMatch(): boolean {
    const originalControl = this.registerForm.get('password.original');
    const confirmControl = this.registerForm.get('password.confirm');
    if (originalControl.touched && confirmControl.touched &&
       (originalControl.value !== confirmControl.value)) {
      this.setError(this._errPasswordMismatch);
      return false;
    }
    return true;
  }

  showRegisterForm() {
    return this.currentState === RegisterUserState.Initial ||
      this.currentState === RegisterUserState.Error;
  }

  showActivateForm() {
    return this.currentState === RegisterUserState.Activate;
  }

  showLoginForm() {
    this.onShowLoginForm.emit();
  }

  showActivateSuccessMessage() {
    return this.currentState == RegisterUserState.ActivateSuccess;
  }
  
  setError(message: string) {
    this.errorMessage = message;
    this.currentState = RegisterUserState.Error;
  }

  clearError() {
    this.errorMessage = "";
    this.currentState = RegisterUserState.Initial;
  }

  hasError() {
    return this.currentState === RegisterUserState.Error;
  }

  // todo: move this to a separate component
  hasActivationError() {
    return this.activateErrorMessage !== "";
  }

  // todo: move this to a separate component
  setActivateError(message: string) {
    this.activateErrorMessage = message;
    this.currentState = RegisterUserState.Activate;
  }

  clearActivateError() {
    this.activateErrorMessage = "";
    this.currentState = RegisterUserState.Activate;
  }
}

enum RegisterUserState {
  Initial,
  Activate,
  ActivateSuccess,
  Error
}
