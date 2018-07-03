import { Injectable, Output, EventEmitter } from "@angular/core";

@Injectable()
export class UserEventsService {
    @Output() onToggleSidenav: EventEmitter<any> = new EventEmitter<any>();

    toggleSidenav() {
        this.onToggleSidenav.emit();
    }
}