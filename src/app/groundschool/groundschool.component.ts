import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalVariables } from '../../globals';
import { MatSidenav } from '@angular/material/sidenav';
import { UIEventsService } from '../core/services/ui-events.service';

@Component({
  selector: 'app-groundschool',
  templateUrl: './groundschool.component.html',
  styleUrls: ['./groundschool.component.scss']
})
export class GroundschoolComponent implements OnInit {
  public facebookUrl: string = GlobalVariables.FACEBOOK_URL;

  @ViewChild(MatSidenav) sidenav: MatSidenav;
  
  constructor(public uiEventsService: UIEventsService) { }

  ngOnInit() {
    this.uiEventsService.onToggleSidenav.subscribe(() => {
      this.toggleSidenav();
    })
  }

  private toggleSidenav() {
    this.sidenav.opened ? this.sidenav.close() : this.sidenav.open();
  }
}
