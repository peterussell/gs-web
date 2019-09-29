import { Component, OnInit } from '@angular/core';
import { User } from '../core/models/user.model';
import { UserService } from '../core/services/user.service';
import { Course } from '../core/models/course.model';
import { QuestionSet } from '../core/models/question-set.model';
import { SubscriptionInfo, PurchasedCourse } from '../core/models/subscription-info.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public currentUser: User;
  public reviewSet: QuestionSet;
  public isLoading: boolean;
  private subscriptionInfo: SubscriptionInfo;
  private purchasedCourses: Array<PurchasedCourse>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    if (this.currentUser && this.currentUser.MemberId) {
      this.isLoading = true;
      this.userService.getProfile(this.currentUser.MemberId).subscribe((data) => {
        this.currentUser.setProfileData(data);
        this.reviewSet = this.currentUser.getReviewSet();
        this.subscriptionInfo = this.currentUser.getSubscriptionInfo();
        this.isLoading = false;
      });
      return;
    }

    this.isLoading = true;
    this.userService.currentUser$.subscribe((user: User) => {
      this.currentUser = user;
      if (!this.currentUser) { return; }

      this.reviewSet = user.getReviewSet();
      this.subscriptionInfo = user.getSubscriptionInfo();
      this.isLoading = false;
    });
  }

  getPurchasedCourses() {
    return this.subscriptionInfo.PurchasedCourses;
  }

  hasCourses(): boolean {
    const courses = this.getPurchasedCourses();
    return courses && (courses.length > 0);
  }

  hasReviewQuestions(): boolean {
    return this.reviewSet
      && this.reviewSet.Questions
      && this.reviewSet.Questions.length > 0;
  }
}
