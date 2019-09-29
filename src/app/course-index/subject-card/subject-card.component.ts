import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from '../../core/models/subject.model';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { MatSnackBar } from '@angular/material';
import { GsSnackbarComponent } from '../../gs-snackbar/gs-snackbar.component';

@Component({
  selector: 'app-subject-card',
  templateUrl: './subject-card.component.html',
  styleUrls: ['./subject-card.component.scss']
})
export class SubjectCardComponent implements OnInit {
  @Input() subject: Subject;
  @Input() parentPath: string;
  @Input() buyLink: string;

  private currentUser: User;
  private _stripe: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this._stripe = Stripe('pk_test_2cKdGLOWOuxYiTWrn8PaC4jS00sNO8cXJk');

    this.userService.currentUser$.subscribe((user: User) => {
      if (user) {
        this.userService.getProfile(user.getCognitoUsername()).subscribe((data) => {
          user.setProfileData(data);
        });
      }
      this.currentUser = user;
    })
  }

  // TODO: show an error (snackbar?) if user isn't logged in...
  // eg. 'Please log in or _register for a free account_ to buy premium courses'
  buyCourse(sku: string) {
    let user = this.userService.getCurrentUser();
    if (!user) {
      this.snackBar.openFromComponent(
        GsSnackbarComponent,
        {
          duration: 5000,
          data: { message: 'Please log in to purchase Premium courses.' },
          panelClass: 'gs-snackbar'
        }
      );
      return;
    }

    this._stripe.redirectToCheckout({
      items: [
        // Replace with the ID of your SKU
        {sku: 'sku_FYkdG5siEvcNkL', quantity: 1}
      ],
      clientReferenceId: user.getCognitoUsername(),
      customerEmail: user.getEmail(),
      successUrl: 'http://localhost:4200/payment-success', // TODO: update these!!!
      cancelUrl: 'http://localhost:4200',     // TODO: update these!!!
    }).then(function (result) {
      // should have been redirected to success/error page
    });
  }

  ownsCourse(subjectId: string): boolean {
    if (!this.currentUser) { return false; }
    return this.currentUser.SubscriptionInfo.ownsPurchasedCourseWithSubject(subjectId);
  }
}
