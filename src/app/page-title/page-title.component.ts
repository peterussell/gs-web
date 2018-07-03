import { Component, OnInit } from '@angular/core';
import { UserEventsService } from '../core/services/user-events.service';
import { ResponsiveService, ViewportSize } from '../core/services/responsive.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {
  menuButtonVisible: boolean;

  constructor(
    public userEventsService: UserEventsService,
    public responsiveService: ResponsiveService) { }

  ngOnInit() {
    this.menuButtonVisible = this.responsiveService.getViewportSize() === ViewportSize.Small;
    this.responsiveService.onViewportChange.subscribe((newViewportSize: ViewportSize) => {
      this.menuButtonVisible = newViewportSize === ViewportSize.Small;
    });
  }

  toggleSidenav() {
    this.userEventsService.toggleSidenav();
  }
}
