import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AccountDialogComponent, AccountDialogState } from '../account-dialog/account-dialog.component';
import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public currentUser: User;

  constructor(
    private userService: UserService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.userService.currentUser$.subscribe((newUser: User) => {
      this.currentUser = newUser;
    });
  }

  registerClick() {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '380px',
      panelClass: 'container-no-padding',
      position: { top: '30px' },
      data: { initialState: AccountDialogState.Register }
    });
  }

  signInClick() {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '380px',
      panelClass: 'container-no-padding',
      position: { top: '30px' },
      data: { initialState: AccountDialogState.Login }
    });
  }

  signOutClick() {
    this.userService.signOut();
  }
}
