import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checklist-helper',
  templateUrl: './checklist-helper.component.html',
  styleUrls: ['./checklist-helper.component.scss']
})
export class ChecklistHelperComponent implements OnInit {
  private actionHistory: string[];
  private actionExpectedExecuted: string[];

  private preStart: string[];

  constructor() {
    this.actionHistory = [];
    this.actionExpectedExecuted = [];

    // tmp - external class
    this.preStart = [];
    this.preStart.push("Park brake: ON");
    this.preStart.push("Fuel: Lowest tank");
    this.preStart.push("Flaps: Check");
    this.preStart.push("Trim: Check");
    this.preStart.push("Mixture: Rich");
  }

  ngOnInit() {
  }

  doAction(item: string, action: string) {
    this.actionHistory.push(`${item}: ${action}`);
  }

  actionMatches(stepIndex: number) {
    console.log(stepIndex);
    return this.preStart[stepIndex] === this.actionHistory[stepIndex];
  }

  reset() {
    this.actionHistory = [];
  }
}