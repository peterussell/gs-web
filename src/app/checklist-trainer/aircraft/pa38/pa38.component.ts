import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Procedure, ProcedureStep } from '../../../core/models/checklist-trainer/procedure';
import { ProcedureList } from '../../../core/models/checklist-trainer/procedure-list';

import * as normalProceduresJson from "~/../assets/checklists/pa-38_normal.json";

@Component({
  selector: 'app-pa38',
  templateUrl: './pa38.component.html',
  styleUrls: ['./pa38.component.scss']
})
export class Pa38Component implements OnInit {
  @Input() currentProcedure: Procedure;
  @Output() onProceduresLoaded: EventEmitter<ProcedureList> = new EventEmitter<ProcedureList>();
  @Output() onProcedureStepExecuted: EventEmitter<ProcedureStep> = new EventEmitter<ProcedureStep>();
  
  constructor() { }

  ngOnInit() {
    this.loadProcedureFile();
  }

  loadProcedureFile() {
    const normalProcedures = new ProcedureList(normalProceduresJson);
    this.onProceduresLoaded.emit(normalProcedures);
  }

  doAction(item: string, action: string, isChecklistItem: boolean = false) {
    let ps = new ProcedureStep();
    ps.Item = item
    ps.Action = action,
    ps.IsChecklistItem = isChecklistItem;
    this.onProcedureStepExecuted.emit(ps);
  }
}
