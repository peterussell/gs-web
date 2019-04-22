import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-gs-snackbar',
  templateUrl: './gs-snackbar.component.html',
  styleUrls: ['./gs-snackbar.component.scss']
})
export class GsSnackbarComponent implements OnInit {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
