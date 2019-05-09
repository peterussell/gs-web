import { Component, OnInit } from '@angular/core';
import { AccountDialogState, AccountDialogComponent } from '../account-dialog/account-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { UserService } from '../core/services/user.service';
import { UIEventsService } from '../core/services/ui-events.service';
import { User } from '../core/models/user.model';
import { UserArn } from 'aws-sdk/clients/codestar';
import { StoreService } from '../core/services/store.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public currentUser: User;

  constructor(
    private userService: UserService,
    private uiEventsService: UIEventsService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userService.currentUser$.subscribe(
      (newUser: User) => {
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

  showMenu() {
    this.uiEventsService.toggleSidenav();
  }
}
