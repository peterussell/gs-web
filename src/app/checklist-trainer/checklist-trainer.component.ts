import { Component, OnInit } from '@angular/core';
import { ChecklistService } from '../core/services/checklist.service';
import { Checklist } from '../core/models/checklists/checklist.model';
import { Procedure } from '../core/models/checklists/procedure.model';

@Component({
  selector: 'app-checklist-trainer',
  templateUrl: './checklist-trainer.component.html',
  styleUrls: ['./checklist-trainer.component.scss']
})
export class ChecklistTrainerComponent implements OnInit {

  constructor(private checklistService: ChecklistService) { }

  ngOnInit() {
    let json = this.checklistService.getChecklist();

    let cl = new Checklist(json);
    
    console.log(cl);
  }

}
