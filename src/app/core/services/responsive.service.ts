import { Injectable, Output, EventEmitter } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { BreakpointState } from "@angular/cdk/layout";

@Injectable()
export class ResponsiveService {
    @Output() onViewportChange: EventEmitter<ViewportSize> = new EventEmitter<ViewportSize>();

    private currentViewportSize: ViewportSize;

    constructor(public breakpointObserver: BreakpointObserver) {
        this.breakpointObserver
        .observe(['(max-width: 780px)'])
        .subscribe((state: BreakpointState) => {
            this.currentViewportSize = state.matches ? ViewportSize.Small : ViewportSize.Large;
            this.onViewportChange.emit(this.currentViewportSize);
      });
    }

    getViewportSize(): ViewportSize {
        return this.currentViewportSize;
    }
}

export enum ViewportSize { Small, Large };