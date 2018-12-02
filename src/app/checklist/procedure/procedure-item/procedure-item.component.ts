import { Component, OnInit, Input } from '@angular/core';
import { ProcedureItem } from '../../../core/models/checklists/procedure-item.model';

@Component({
  selector: 'app-procedure-item',
  templateUrl: './procedure-item.component.html',
  styleUrls: ['./procedure-item.component.scss']
})
export class ProcedureItemComponent implements OnInit {
  @Input() procedureItem: ProcedureItem;
  
  private isVisible = false;

  constructor() { }

  ngOnInit() {
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

}
