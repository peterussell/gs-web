import { Component, OnInit } from '@angular/core';
import { QuestionSet } from '../core/models/question-set.model';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Course } from '../core/models/course.model';
import { Topic } from '../core/models/topic.model';
import { ApiService } from '../core/services/api.service';
import { Reference } from '../core/models/reference.model';

@Component({
  selector: 'app-question-editor',
  templateUrl: './question-editor.component.html',
  styleUrls: ['./question-editor.component.scss']
})
export class QuestionEditorComponent implements OnInit {
  addQuestionForm: FormGroup;
  courses: Array<Course>;
  topics: Array<Topic>;
  questionSets: Array<QuestionSet>;
  selectedCourse: Course;
  selectedTopic: Topic;
  selectedQuestionSet: QuestionSet;
  references: FormArray;
  waypointsReferenceValuesMissing: boolean = false;

  questionSetsToUpdate: Array<QuestionSetToUpdate> = new Array<QuestionSetToUpdate>();

  addingQuestionReturnedSuccess: boolean = false;
  addingQuestionReturnedError: boolean = false;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit() {
    this.addQuestionForm = new FormGroup({
      'questionSet': new FormControl(null),
      'questionText': new FormControl(null, Validators.required),
      'answerText': new FormControl(null, Validators.required),
      'references': this.formBuilder.array([]),
      'waypointsVolume': new FormControl(null),
      'waypointsChapter': new FormControl(null)
    });

    this.apiService.getCourses().subscribe((response: any) => {
      let courses: Array<Course> = response.courses;

      // TODO: extract this to a utility class, eg. sortCoursesByOrdering(..)
      this.courses = courses.sort((a, b) => {
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0;
      });

      if (this.courses !== undefined && this.courses.length > 0) {
        this.selectCourse(this.courses[0]);
      }
    });

    // Initialise an empty reference (user can add more as required)
    this.addBlankReference();
  }

  onSubmit() {
    this.addingQuestionReturnedSuccess = false;
    this.addingQuestionReturnedError = false;

    const questionText = this.addQuestionForm.get('questionText').value;
    const answerText = this.addQuestionForm.get('answerText').value;
    const references = this.mapReferenceFieldsToReferences();

    this.questionSetsToUpdate.forEach(qs => {
      this.apiService.addQuestion(qs.questionSetId, questionText, answerText, references)
        .subscribe((response: any) => {
          this.addingQuestionReturnedSuccess = true;
          this.addingQuestionReturnedError = false;
          this.resetForm();
        }, (error: any) => {
          console.log(error);
          this.addingQuestionReturnedSuccess = false;
          this.addingQuestionReturnedError = true;
        });
    });
  }

  resetForm() {
    this.addQuestionForm.reset();
  }

  addSelectedQuestionSet() {
    // Don't add question sets we're already updating
    if (this.questionSetsToUpdate.some(
      q => q.questionSetId === this.selectedQuestionSet.questionSetId)
    ) {
      return;
    }

    let toUpdate = new QuestionSetToUpdate();
    toUpdate.questionSetId = this.selectedQuestionSet.questionSetId;
    toUpdate.description =
      `${this.selectedCourse.title} > ${this.selectedTopic.title} > ${this.selectedQuestionSet.title}`;
    this.questionSetsToUpdate.push(toUpdate);
  }

  removeQuestionSet(index: number) {
    this.questionSetsToUpdate.splice(index, 1);
  }

  addBlankReference() {
    this.references = this.addQuestionForm.get('references') as FormArray;
    this.references.push(this.createReference());
  }

  createReference(text: string='', url: string=''): FormGroup {
    return this.formBuilder.group({
      text: text,
      url: url,
    });
  }

  addWaypointsReference() {
    this.waypointsReferenceValuesMissing = false;

    let volume = this.addQuestionForm.get('waypointsVolume').value;
    let chapter = this.addQuestionForm.get('waypointsChapter').value;

    if (volume === null || chapter === null) {
      this.waypointsReferenceValuesMissing = true;
      return;
    }

    const text = (volume === 'hf' ? `Human factors` : `Waypoints Volume ${volume}`) + `, Chapter ${chapter}`;

    const url = this.getWaypointsUrl(volume);
    this.references.insert(0, this.createReference(text, url));
  }

  getWaypointsUrl(volume: string): string {
    const urls: { [volume: string]: string } = {
      '1': 'https://www.waypoints.nz/collections/private-pilots-licence-1/products/vol-01-ppl-aircraft-technical-knowledge-april-2013',
      '2': 'https://www.waypoints.nz/collections/private-pilots-licence-1/products/vol-02-ppl-cpl-navigation-and-flight-planning-march-2012',
      '3': 'https://www.waypoints.nz/collections/private-pilots-licence-1/products/vol-03-ppl-weather-to-fly-meteorology-june-2014',
      '4': 'https://www.waypoints.nz/collections/private-pilots-licence-1/products/vol-04-flight-radio-for-pilots-july-2016',
      '5': 'https://www.waypoints.nz/collections/private-pilots-licence-1/products/vol-05-ppl-cpl-air-law-january-2017',
      '6': 'https://www.waypoints.nz/collections/commercial-pilots-licence/products/vol-06-cpl-atpl-meteorology-for-professional-pilots-january-2016',
      '7': 'https://www.waypoints.nz/collections/commercial-pilots-licence/products/vol-07-cpl-principles-of-flight-and-performance-march-2016',
      '8': 'https://www.waypoints.nz/collections/commercial-pilots-licence/products/vol-08-cpl-general-aircraft-technical-knowledge-february-2016',
      'hf': 'https://www.waypoints.nz/collections/private-pilots-licence-1/products/aviation-medicine-and-other-human-factors-for-pilots-6th-edn-2008'
    };
    return urls[volume];
  }

  addCARReference(referenceIndex: number, partNumber: string) {
    // Add placeholder parentheses to all CAR parts except part 1
    const text = `Cart Part ${partNumber}` + (partNumber !== '1' ? ' (...)' : '');

    // Build the URL
    const paddedPartNumber = partNumber.padStart(3, '0');
    const url = `https://www.caa.govt.nz/rules/Rule_Consolidations/Part_${paddedPartNumber}_Consolidation.pdf`;

    let referenceToUpdate = this.references.controls[referenceIndex] as FormArray;
    let textControl = referenceToUpdate.controls['text'] as FormControl;
    let urlControl = referenceToUpdate.controls['url'] as FormControl;
    textControl.setValue(text);
    urlControl.setValue(url);
  }

  mapReferenceFieldsToReferences(): Array<Reference> {
    let referencesToSubmit = new Array<Reference>();
    this.references.controls.forEach(r => {
      if (r.value['text'] !== '') {
        let text = r.value['text'];
        let url = r.value['url'];
        if (url === undefined || url === null) {
          url = '';
        };
        referencesToSubmit.push(new Reference(text, url));
      }
    });
    return referencesToSubmit;
  }

  getFormReferences(): FormArray {
    return this.addQuestionForm.get('references') as FormArray;
  }

  // Material event handlers
  matSelectCourse(event: MatSelectChange) {
    this.selectCourse(event.value);
  }
  
  matSelectTopic(event: MatSelectChange) {
    this.selectTopic(event.value);
  }

  matSelectQuestionSet(event: MatSelectChange) {
    this.selectQuestionSet(event.value);
  }

  selectCourse(course: Course) {
    if (course === null) { return; }
    this.selectedCourse = course;
    // TODO: extract to utility class
    this.topics = this.selectedCourse.topics.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    if (this.selectedCourse.topics !== null && this.selectedCourse.topics.length > 0) {
      this.selectTopic(this.selectedCourse.topics[0]);
    }
  }

  selectTopic(topic: Topic) {
    if (topic === null) { return; }
    this.selectedTopic = topic;
    // TODO: extract to utility class
    this.questionSets = this.selectedTopic.questionSets.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    if (this.selectedTopic.questionSets !== null && this.selectedTopic.questionSets.length > 0) {
      this.selectQuestionSet(this.selectedTopic.questionSets[0]);
    }
  }

  selectQuestionSet(questionSet: QuestionSet) {
    if (questionSet === null) { return; }
    this.selectedQuestionSet = questionSet;
  }
}

class QuestionSetToUpdate {
  description: string;
  questionSetId: string;
}