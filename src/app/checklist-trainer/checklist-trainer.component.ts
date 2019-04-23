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
    return expected.Item.toLocaleLowerCase() === actual.Item.toLocaleLowerCase()
      && expected.Action.toLocaleLowerCase() === actual.Action.toLocaleLowerCase();
  }

  reset() {
    this.actionHistory = [];
    this.lastExpectedStep = undefined;
    this.lastActualStep = undefined;
  }
}