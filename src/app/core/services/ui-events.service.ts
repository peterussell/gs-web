import { Injectable, Output, EventEmitter } from "@angular/core";

@Injectable()
export class UIEventsService {
    @Output() onToggleSidenav: EventEmitter<any> = new EventEmitter<any>();

    toggleSidenav() {
        this.onToggleSidenav.emit();
    }
}