import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ChecklistService {
    constructor(private httpClient: HttpClient) { }

    getChecklist() {
        return require('../../../../checklists-json/pa-28-161.json'); 
    }
}