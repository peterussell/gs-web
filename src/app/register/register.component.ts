import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public email: string;
  public password: string;
  public confirmPassword: string;

  constructor() { }

  ngOnInit() {
  }

  onRegister(event: Event) {
    event.preventDefault();
    
    console.log('email', this.email);
    console.log('password', this.password);
    console.log('confirmPassword', this.confirmPassword);
  }

}
