import { Component, OnInit } from '@angular/core';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { QuestionSet } from '../../core/models/question-set.model';

@Component({
  selector: 'app-review-dashboard',
  templateUrl: './review-dashboard.component.html',
  styleUrls: ['./review-dashboard.component.scss']
})
export class ReviewDashboardComponent implements OnInit {
  public currentUser: User;
  public reviewSet: QuestionSet;
  public isLoading: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    if (this.currentUser && this.currentUser.MemberId) {
      this.isLoading = true;
      this.userService.getProfile(this.currentUser.MemberId).subscribe((data) => {
        this.currentUser.setProfileData(data);
        this.reviewSet = this.currentUser.getReviewSet();
        this.isLoading = false;
      });
      return;
    }

    this.isLoading = true;
    this.userService.currentUser$.subscribe((user: User) => {
      this.currentUser = user;
      if (!this.currentUser) { return; }

      this.reviewSet = user.getReviewSet();
      this.isLoading = false;
    });
  }
}
