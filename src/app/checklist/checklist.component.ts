import { Component, OnInit } from '@angular/core';
import { ChecklistService } from '../core/services/checklist.service';
import { Checklist } from '../core/models/checklists/checklist.model';
import { Procedure } from '../core/models/checklists/procedure.model';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {
  private checklist: Checklist;
  private currentProcedure: Procedure;
  private currentIndex: number = 0;

  constructor(private checklistService: ChecklistService) { }

  ngOnInit() {
    let json = this.checklistService.getChecklist();
    this.checklist = new Checklist(json);

    // load the first procedure
    if (this.checklist.procedures !== undefined &&
        this.checklist.procedures.length > 0) {
        this.updateCurrentProcedure(0);
    }
  }

  updateCurrentProcedure(newIndex: number) {
    if (this.checklist === undefined ||
        this.checklist.procedures.length === 0 ||
        newIndex < 0 ||
        newIndex > this.checklist.procedures.length) {
      return;
    }
    this.currentProcedure = this.checklist.procedures[newIndex];
  }

  canGoPrevious() {
    return this.currentIndex > 0;
  }

  canGoNext() {
    return this.currentIndex < this.checklist.procedures.length - 1;
  }

  goToPreviousProcedure() {
    if (!this.canGoPrevious()) {
      return;
    }
    this.currentIndex = this.currentIndex -1;
    this.updateCurrentProcedure(this.currentIndex);
  }

  goToNextProcedure() {
    if (!this.canGoNext()) {
      return;
    }
    this.currentIndex = this.currentIndex + 1;
    this.updateCurrentProcedure(this.currentIndex);
  }

}
