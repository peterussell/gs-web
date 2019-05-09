import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProcedureList } from '../core/models/checklist-trainer/procedure-list';
import { Procedure, ProcedureStep } from '../core/models/checklist-trainer/procedure';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-checklist-trainer',
  templateUrl: './checklist-trainer.component.html',
  styleUrls: ['./checklist-trainer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChecklistTrainerComponent implements OnInit {
  private currentAircraft: AvailableAircraft;
  private actionHistory: ProcedureStep[];

  public procedureList: ProcedureList;
  public defaultValue: string;
  public currentProcedure: Procedure;
  
  public lastExpectedStep: ProcedureStep;
  public lastActualStep: ProcedureStep;

  constructor() {
    this.actionHistory = [];
  }

  ngOnInit() {
    this.currentProcedure = new Procedure();
    this.procedureList = new ProcedureList();
  }

  showSelector() {
    return this.currentAircraft === undefined;
  }

  selectTrainer(identifier: string) {
    switch (identifier.toLocaleLowerCase()) {
      case 'pa-28':
        this.currentAircraft = AvailableAircraft.PA28;
        break;
      case 'pa-38':
        this.currentAircraft = AvailableAircraft.PA38;
        break;
    }
  }

  onProcedureSelected(event: MatSelectChange) {
    this.reset();
    let match = this.procedureList.Procedures.find((p: Procedure) => {
      return p.Title === event.value;
    });
    this.currentProcedure = match;
  }

  proceduresLoaded(procedureList: ProcedureList) {
    this.procedureList = procedureList;
    if (this.procedureList !== undefined) {
      this.defaultValue = this.procedureList.Procedures[0].Title;
      this.onProcedureSelected(new MatSelectChange(null, this.defaultValue));
    }
  }
  
  procedureStepExecuted(executed: ProcedureStep) {
    this.actionHistory.push(executed);
    this.lastActualStep = executed;
    this.lastExpectedStep = this.currentProcedure.Steps[this.actionHistory.length-1];
  }

  isLastStepCorrect() {
    return this.isMatch(this.lastExpectedStep, this.lastActualStep);
  }

  isMatch(expected: ProcedureStep, actual: ProcedureStep) {
    const itemMatches = expected.Item.toLocaleLowerCase() === actual.Item.toLocaleLowerCase();

    // If one is a checklist item and the other isn't - no match
    if (expected.IsChecklistItem && !actual.IsChecklistItem ||
        !expected.IsChecklistItem && actual.IsChecklistItem) { return false; }

    // Checklist for both, check the item matches (checklists don't have an action)
    if (expected.IsChecklistItem && actual.IsChecklistItem && itemMatches) { return true; }

    // Non-checklist, check both item and action match
    const actionMatches = expected.Action.toLocaleLowerCase() === actual.Action.toLocaleLowerCase();
    return itemMatches && actionMatches;
  }

  reset() {
    this.actionHistory = [];
    this.lastExpectedStep = undefined;
    this.lastActualStep = undefined;
  }
}

enum AvailableAircraft {
  PA28,
  PA38
}