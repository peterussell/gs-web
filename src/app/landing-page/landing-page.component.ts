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
  public facebookUrl: string = GlobalVariables.FACEBOOK_URL;

  constructor() {}

  ngOnInit() {

  }
}