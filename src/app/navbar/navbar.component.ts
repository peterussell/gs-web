import { Component, OnInit } from '@angular/core';
import { AccountDialogState, AccountDialogComponent } from '../account-dialog/account-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public currentUser: CognitoUser;

  constructor(private userService: UserService, public dialog: MatDialog) { }

  ngOnInit() {
    this.userService.currentUser$.subscribe(
      (newUser: CognitoUser) => {
        this.currentUser = newUser;
      }
    );
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
