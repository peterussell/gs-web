import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { GlobalVariables } from '../../globals';
import { UserService } from '../core/services/user.service';
import { RegisterInterestResponse } from '../core/services/interfaces/register-interest-response';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  registerInterestForm: FormGroup;
  private errorMessage: string = "";
  private currentState: RegisterInterestState = RegisterInterestState.Initial;
  private isProcessing: boolean = false;
  public facebookUrl: string = GlobalVariables.FACEBOOK_URL;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.registerInterestForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email])
    })
  }

  onRegisterInterest() {
    this.clearErrors();
    this.registerInterestForm.disable();

    this.userService.registerInterest(this.registerInterestForm.get('email').value)
      .finally(() => this.registerInterestForm.enable())
      .subscribe(
        // success
        (res: any) => {
          if (res.status === 201) {
            this.currentState = RegisterInterestState.Success;
          } else {
            this.errorMessage = 'An unexpected error occurred, please try again.';
          }
        },
        // error
        (error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            this.errorMessage = 'An unexpected error occurred, please try again.';
          } else {
            if (error.status === 409) {
              this.errorMessage = error.error.message;
            }
          }
        }
      );
  }

  showRegisterForm() {
    return this.currentState === RegisterInterestState.Initial;
  }

  clearErrors() {
    this.errorMessage = '';
  }
}

enum RegisterInterestState {
  Initial,
  Success
}
