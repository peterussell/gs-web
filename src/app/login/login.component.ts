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

  public readonly u: { u: string, p: string}[] = [
    { 'u': 'gs1', 'p': 'temp_253' },
    { 'u': 'gs2', 'p': 'temp_919' },
    { 'u': 'gs3', 'p': 'temp_564' },
    { 'u': 'gs4', 'p': 'temp_175' },
    { 'u': 'gs5', 'p': 'temp_632' },
    { 'u': 'gs6', 'p': 'temp_255' },
    { 'u': 'gs7', 'p': 'temp_770' },
    { 'u': 'gs8', 'p': 'temp_283' },
    { 'u': 'gs9', 'p': 'temp_186' },
    { 'u': 'gs100', 'p': 'temp_618' },
    { 'u': '100', 'p': 'demo' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onLogin(event: Event) {
    event.preventDefault();

    let success = false;
    for (let i=0; i<this.u.length; i++) {
      if (this.username.toLowerCase() === this.u[i]['u'] && this.password === this.u[i]['p']) {
        success = true;
        break;
      }
    }

    if (success) {
      this.router.navigate(['/courses', 'cpl']);
    } else {
      this.username = "";
      this.password = "";
    }
  }
}
