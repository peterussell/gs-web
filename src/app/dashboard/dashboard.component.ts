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
  private subscriptionInfo: SubscriptionInfo;
  private purchasedCourses: Array<PurchasedCourse>;
  private reviewSet: QuestionSet;
  private isLoading: boolean;
  
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.isLoading = true;
    this.userService.currentUser$.subscribe((user: User) => {
      if (!user) { return; }
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
}
