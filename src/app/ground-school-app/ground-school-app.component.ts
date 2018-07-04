import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { UserEventsService } from '../core/services/user-events.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BreakpointState } from '@angular/cdk/layout';
import { ResponsiveService, ViewportSize } from '../core/services/responsive.service';

@Component({
  selector: 'app-ground-school-app',
  templateUrl: './ground-school-app.component.html',
  styleUrls: ['./ground-school-app.component.scss']
})
export class GroundSchoolAppComponent implements OnInit, OnDestroy {
  private readonly menuBreakpoint: number = 780;

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  constructor(
    public userEventsService: UserEventsService,
    public responsiveService: ResponsiveService) { }

  ngOnInit() {
    // initial load
    this.setMenuMode(this.responsiveService.getViewportSize());

    // window resize
    this.responsiveService.onViewportChange.subscribe((newViewportSize: ViewportSize) => {
      this.setMenuMode(newViewportSize);
    });
    this.userEventsService.onToggleSidenav.subscribe(() => { this.toggleSidenav(); });
  }

  ngOnDestroy() {
    this.userEventsService.onToggleSidenav.unsubscribe();
  }

  private toggleSidenav() {
    this.sidenav.opened ? this.sidenav.close() : this.sidenav.open();
  }

  private setMenuMode(viewportSize: ViewportSize) {
    if (viewportSize === ViewportSize.Small) {
      this.sidenav.mode = "over";
      this.sidenav.close();
    } else {
      this.sidenav.mode = "side";
      this.sidenav.open();
    }
  }
}
