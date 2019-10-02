import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public currentUser: User;

  constructor(
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.userService.currentUser$.subscribe((newUser: User) => {
      this.currentUser = newUser;
    });
  }

  registerClick() {
    this.router.navigate(['/register']);
  }

  signInClick() {
    this.router.navigate(['/login']);
  }

  signOutClick() {
    this.userService.signOut();
  }
}
