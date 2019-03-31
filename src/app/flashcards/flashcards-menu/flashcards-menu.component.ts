import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from '../../core/models/subject.model';

@Component({
  selector: 'app-flashcards-menu',
  templateUrl: './flashcards-menu.component.html',
  styleUrls: ['./flashcards-menu.component.scss']
})
export class FlashcardsMenuComponent implements OnInit {
  @Input() subject: Subject;
  @Input() selectedTopicId: string;

  @Output() topicSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  isSelected(topicId: string) {
    if (this.selectedTopicId === undefined || this.selectedTopicId === '') {
      return false;
    }
    return this.selectedTopicId === topicId;
  }

  selectTopic(topicId: string) {
    this.topicSelected.emit(topicId);
  }
}
