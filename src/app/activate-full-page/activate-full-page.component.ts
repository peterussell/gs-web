import { Component, OnDestroy } from '@angular/core';
import { ActivateComponent } from '../activate/activate.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-activate-full-page',
  templateUrl: './activate-full-page.component.html',
  styleUrls: ['./activate-full-page.component.scss']
})
export class ActivateFullPageComponent implements OnDestroy {
  private dialogRef;

  constructor(private dialog: MatDialog) {
    this.dialogRef = this.dialog.open(ActivateComponent, {
      width: '380px',
      panelClass: 'container-no-padding',
      position: { top: '30px' },
      disableClose: true
    });
  }

  // TODO (working here): close the dialog on router change events
  ngOnDestroy() {
    this.dialogRef.close();
  }
}
