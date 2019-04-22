import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProcedureList } from '../../../core/models/checklist-trainer/procedure-list';

import * as normalProceduresJson from "~/../assets/checklists/pa-28-161-warrior-ii-avidyne_normal.json";
import { Procedure, ProcedureStep } from '../../../core/models/checklist-trainer/procedure';

@Component({
  selector: 'app-piper-warrior-ii-avidyne',
  templateUrl: './piper-warrior-ii-avidyne.component.html',
  styleUrls: ['./piper-warrior-ii-avidyne.component.scss']
})
export class PiperWarriorIiAvidyneComponent implements OnInit {
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