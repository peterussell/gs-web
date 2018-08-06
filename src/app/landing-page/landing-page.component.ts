import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  registerInterestForm: FormGroup;

  constructor(private renderer: Renderer2) {
    this.renderer.setStyle(document.body, 'background-color', '#36454f');
  }

  ngOnInit() {
    this.registerInterestForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email])
    })
  }

  onRegisterInterest() {
    console.log('onRegisterInterest() called');
    console.log('name', this.registerInterestForm.get('name').value);
    console.log('email', this.registerInterestForm.get('email').value);
  }

}
