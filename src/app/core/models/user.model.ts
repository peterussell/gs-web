import { Product } from "./product.model";
import { CognitoUser } from "amazon-cognito-identity-js";
import { QuestionSet } from "./question-set.model";
import { ApiService } from "../services/api.service";
import { Course } from "./course.model";
import { Subject } from "./subject.model";
import { Topic } from "./topic.model";
import { SubscriptionInfo } from "./subscription-info.model";
import { Question } from "./question.model";

export class User {
    public CognitoUser: CognitoUser;
    public MemberId: string;
    public Name: string;
    public OrganisationId: string;
    public SubscriptionInfo: SubscriptionInfo;
    public ReviewSet: QuestionSet

    private _reviewSetKey: string = 'r';

    constructor(cognitoUser: CognitoUser, profileData?: any) {
        this.CognitoUser = cognitoUser;
        this.setProfileData(profileData);
    }

    setProfileData(profileData?: any) {
        if (profileData === undefined) { return; }

        this.MemberId = profileData['MemberId'];
        this.Name = profileData['Name'];
        this.OrganisationId = profileData['OrganisationId'];
        this.SubscriptionInfo = new SubscriptionInfo(profileData['SubscriptionInfo']);
        this.ReviewSet = new QuestionSet();
        this.ReviewSet.setQuestions(profileData['ReviewSet']);
    }

    getCognitoUsername(): string {
        return this.CognitoUser['username'];
    }

    getEmail(): string {
        return this.CognitoUser['attributes']['email'];
    }

    getSubscriptionInfo(): SubscriptionInfo {
        return this.SubscriptionInfo;
    }

    ownsPurchasedCourseWithSubject(subjectId: string): boolean {
        return this.SubscriptionInfo.ownsPurchasedCourseWithSubject(subjectId);
    }

    getReviewSet() {
        return this.ReviewSet;
    }

    updateReviewSet(questions: Array<Question>) {
        let rs = this.getReviewSet();
        if (!rs) {
            // If we just created the review set (happens when this is the first
            // question that's added, so the review set is also created), we won't
            // have a local copy on the user profile yet. We create a placeholder
            // review set here, which will get overwritten the next time the user
            // profile is loaded. Because the source of truth is the DB, this
            // should be a safe way to handle this.
            let tmpqs = new QuestionSet();
            tmpqs.Type = 'r';
            this.ReviewSet = tmpqs;
        }
        this.ReviewSet.Questions = questions;
    }

    addToReviewSet(question: Question) {
        let rs = this.getReviewSet();
        if (!rs) {
            let tmpqs = new QuestionSet();
            tmpqs.Type = 'r';
            tmpqs.Questions = new Array<Question>();
            this.ReviewSet = tmpqs;
        } else if (this.ReviewSet.Questions === null) {
            this.ReviewSet.Questions = new Array<Question>();
        }
        this.ReviewSet.Questions.push(question);
    }

    removeFromReviewSet(question: Question) {
        let rs = this.getReviewSet();
        if (!rs) {
            return; // shouldn't happen, but just in case
        }
        this.ReviewSet.Questions = rs.Questions.filter((q: Question) => {
            return q.QuestionId !== question.QuestionId;
        });
    }
}