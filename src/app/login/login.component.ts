import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  doLogin(event: Event) {
    event.preventDefault();
    
    // tmp
    if (this.username === 'demo' && this.password === 'demo') {
      this.router.navigate(['/courses', 'cpl']);
    } else {
      this.username = "";
      this.password = "";
    }
  }

}
