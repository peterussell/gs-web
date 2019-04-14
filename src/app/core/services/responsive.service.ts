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

    private readonly smallViewportBreakpoints = [
        Breakpoints.XSmall,
        Breakpoints.Small
    ];

    constructor(public breakpointObserver: BreakpointObserver) {
        // initial load
        this.currentViewportSize = this.breakpointObserver.isMatched(this.smallViewportBreakpoints) ?
            ViewportSize.Small : ViewportSize.Large;

        // change events
        this.breakpointObserver
            .observe(this.smallViewportBreakpoints)
            .subscribe((state: BreakpointState) => {
                this.currentViewportSize = state.matches ? ViewportSize.Small : ViewportSize.Large;
                this.onViewportChange.emit(this.currentViewportSize);
            }
        );
    }

    getViewportSize(): ViewportSize {
        return this.currentViewportSize;
    }
}

export enum ViewportSize { Small, Large };