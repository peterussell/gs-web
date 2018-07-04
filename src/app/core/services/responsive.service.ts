import { Injectable, Output, EventEmitter } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { BreakpointState } from "@angular/cdk/layout";
import { Breakpoints } from "@angular/cdk/layout";

@Injectable()
export class ResponsiveService {
    @Output() onViewportChange: EventEmitter<ViewportSize> = new EventEmitter<ViewportSize>();

    private currentViewportSize: ViewportSize;
    private readonly largeViewportBreakpoints = [
        Breakpoints.Web,
        Breakpoints.WebLandscape,
        Breakpoints.Tablet,
        Breakpoints.TabletLandscape
    ];

    constructor(public breakpointObserver: BreakpointObserver) {
        // initial load
        this.currentViewportSize = this.breakpointObserver.isMatched(this.largeViewportBreakpoints) ?
            ViewportSize.Large : ViewportSize.Small;

        // change events
        this.breakpointObserver
            .observe(this.largeViewportBreakpoints)
            .subscribe((state: BreakpointState) => {
                this.currentViewportSize = state.matches ? ViewportSize.Large : ViewportSize.Small;
                this.onViewportChange.emit(this.currentViewportSize);
            }
        );
    }

    getViewportSize(): ViewportSize {
        return this.currentViewportSize;
    }
}

export enum ViewportSize { Small, Large };