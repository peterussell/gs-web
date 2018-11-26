import { Component, OnInit } from '@angular/core';
import { Topic } from '../core/models/topic.model';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Course } from '../core/models/course.model';
import { Subject } from '../core/models/subject.model';
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
  subjects: Array<Subject>;
  topics: Array<Topic>;
  selectedCourse: Course;
  selectedSubject: Subject;
  selectedTopic: Topic;
  references: FormArray;
  waypointsReferenceValuesMissing: boolean = false;

  topicsToUpdate: Array<TopicToUpdate> = new Array<TopicToUpdate>();

  addingQuestionReturnedSuccess: boolean = false;
  addingQuestionReturnedError: boolean = false;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit() {
    this.addQuestionForm = new FormGroup({
      'topic': new FormControl(null),
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

    this.topicsToUpdate.forEach(qs => {
      this.apiService.addQuestion(qs.topicId, questionText, answerText, references)
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
    this.resetReferences();
  }

  addSelectedTopic() {
    // Don't add topics we're already updating
    if (this.topicsToUpdate.some(
      q => q.topicId === this.selectedTopic.topicId)
    ) {
      return;
    }

    let toUpdate = new TopicToUpdate();
    toUpdate.topicId = this.selectedTopic.topicId;
    toUpdate.description =
      `${this.selectedCourse.title} > ${this.selectedSubject.title} > ${this.selectedTopic.title}`;
    this.topicsToUpdate.push(toUpdate);
  }

  removeTopic(index: number) {
    this.topicsToUpdate.splice(index, 1);
  }

  resetReferences() {
    this.addQuestionForm.setControl('references', this.formBuilder.array([]));
    this.addBlankReference();
  }

  getFormReferences(): FormArray {
    return this.addQuestionForm.get('references') as FormArray;
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

  // Material event handlers
  matSelectCourse(event: MatSelectChange) {
    this.selectCourse(event.value);
  }
  
  matSelectSubject(event: MatSelectChange) {
    this.selectSubject(event.value);
  }

  matSelectTopic(event: MatSelectChange) {
    this.selectTopic(event.value);
  }

  selectCourse(course: Course) {
    if (course === null) { return; }
    this.selectedCourse = course;
    // TODO: extract to utility class
    this.subjects = this.selectedCourse.subjects.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    if (this.selectedCourse.subjects !== null && this.selectedCourse.subjects.length > 0) {
      this.selectSubject(this.selectedCourse.subjects[0]);
    }
  }

  selectSubject(subject: Subject) {
    if (subject === null) { return; }
    this.selectedSubject = subject;
    // TODO: extract to utility class
    this.topics = this.selectedSubject.topics.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    if (this.selectedSubject.topics !== null && this.selectedSubject.topics.length > 0) {
      this.selectTopic(this.selectedSubject.topics[0]);
    }
  }

  selectTopic(topic: Topic) {
    if (topic === null) { return; }
    this.selectedTopic = topic;
  }
}

class TopicToUpdate {
  description: string;
  topicId: string;
}