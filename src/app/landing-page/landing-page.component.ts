import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { GlobalVariables } from '../../globals';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  registerInterestForm: FormGroup;
  private facebookUrl: string = GlobalVariables.FACEBOOK_URL;

  constructor(private renderer: Renderer2, private userService: UserService) {
    this.renderer.setStyle(document.body, 'background-color', '#36454f');
  }

  ngOnInit() {
    this.registerInterestForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email])
    })
  }

  onRegisterInterest() {
    this.userService.registerInterest(
      this.registerInterestForm.get('name').value,
      this.registerInterestForm.get('email').value
    );
  }

}
