import { Injectable, Output, EventEmitter } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { BreakpointState } from "@angular/cdk/layout";
import { Breakpoints } from "@angular/cdk/layout";

@Injectable()
export class ResponsiveService {
    @Output() onViewportChange: EventEmitter<ViewportSize> = new EventEmitter<ViewportSize>();

    private currentViewportSize: ViewportSize;

    constructor(public breakpointObserver: BreakpointObserver) {
        this.breakpointObserver
        .observe([Breakpoints.Web, Breakpoints.WebLandscape, Breakpoints.Tablet, Breakpoints.TabletLandscape])
        .subscribe((state: BreakpointState) => {
            this.currentViewportSize = state.matches ? ViewportSize.Large : ViewportSize.Small;
            this.onViewportChange.emit(this.currentViewportSize);
      });
    }

    getViewportSize(): ViewportSize {
        return this.currentViewportSize;
    }
}

export enum ViewportSize { Small, Large };