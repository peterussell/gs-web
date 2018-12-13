import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
  public activateForm: FormGroup;
  private activateErrorMessage: string;
  private currentState: ActivateAccountState;
  
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.activateForm = new FormGroup({
      'email': new FormControl(null, Validators.required),
      'code': new FormControl(null, Validators.required)
    });
  }

  onActivate() {
    this.activateForm.disable();
    this.userService.activateUser(
      this.activateForm.get('email').value,
      this.activateForm.get('code').value
    )
    .then(res => {
      this.activateForm.enable();
      this.currentState = ActivateAccountState.Success;
    })
    .catch(err => {
      this.activateForm.enable();
      this.setActivateError(err.message);
      this.currentState = ActivateAccountState.NotYetActivated
    });
  }

  showActivateSuccessMessage() {
    return this.currentState == ActivateAccountState.Success;
  }

  hasActivationError() {
    return this.activateErrorMessage !== "";
  }

  setActivateError(message: string) {
    this.activateErrorMessage = message;
    this.currentState = ActivateAccountState.NotYetActivated;
  }

  clearActivateError() {
    this.activateErrorMessage = "";
    this.currentState = ActivateAccountState.NotYetActivated;
  }
}

enum ActivateAccountState {
  NotYetActivated,
  Success
}
