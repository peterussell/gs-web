import { Component, OnInit, Input } from '@angular/core';
import { Procedure } from '../../core/models/checklists/procedure.model';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.scss']
})
export class ProcedureComponent implements OnInit {
  @Input() procedure: Procedure;
  
  constructor() { }

  ngOnInit() {
  }
}
