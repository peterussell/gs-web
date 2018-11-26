import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question } from '../../core/models/question.model';
import { ApiService } from '../../core/services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-report-question-dialog',
  templateUrl: './report-question-dialog.component.html',
  styleUrls: ['./report-question-dialog.component.scss']
})
export class ReportQuestionDialogComponent implements OnInit {
  reportQuestionForm: FormGroup;
  currentState: ReportQuestionState = ReportQuestionState.ShowForm;

  constructor(
    public dialogRef: MatDialogRef<ReportQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { question: Question },
    public apiService: ApiService) { }

  ngOnInit() {
    this.reportQuestionForm = new FormGroup({
      'reason': new FormControl(null, Validators.required),
      'description': new FormControl(null),
      'email': new FormControl(null, this.customEmailValidator)
    });
  }

  onSubmit() {
    this.apiService.reportQuestion(
      this.data.question.questionId,
      this.reportQuestionForm.get('reason').value,
      this.reportQuestionForm.get('description').value,
      this.reportQuestionForm.get('email').value
    ).subscribe(
      // success
      (res: any) => {
        if (res.status === 201) {
          this.currentState = ReportQuestionState.ShowConfirmation;
        } else {
          // TODO
          // console.log('an unexpected error occurred');
        }
      },
      // error
      (error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          // TODO
          // console.log('a different unexpected error occurred');
        } else {
          if (error.status === 409) {
            // TODO
            // console.log(error.error.message);
          }
        }
      }
    );
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  showForm() {
    return this.currentState === ReportQuestionState.ShowForm;
  }

  showConfirmation() {
    return this.currentState === ReportQuestionState.ShowConfirmation;
  }

  private customEmailValidator(control: AbstractControl): ValidationErrors {
    if (!control.value) {
      return null;
    }
    return Validators.email(control);
  }
}

enum ReportQuestionState {
  ShowForm,
  ShowConfirmation
}