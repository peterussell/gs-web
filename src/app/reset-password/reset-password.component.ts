import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public email: string;

  constructor() { }

  ngOnInit() {
  }

  onResetPassword(event: Event) {
    console.log(this.email);
  }
}
