import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signed-out',
  templateUrl: './signed-out.component.html',
  styleUrls: ['./signed-out.component.scss']
})
export class SignedOutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  signInClick() {
    this.router.navigate(['/login']);
  }
}