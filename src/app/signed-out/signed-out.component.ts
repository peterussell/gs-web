import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AccountDialogComponent, AccountDialogState } from '../account-dialog/account-dialog.component';

@Component({
  selector: 'app-signed-out',
  templateUrl: './signed-out.component.html',
  styleUrls: ['./signed-out.component.scss']
})
export class SignedOutComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  signInClick() {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '380px',
      panelClass: 'container-no-padding',
      position: { top: '30px' },
      data: { initialState: AccountDialogState.Login }
    });
  }
}
