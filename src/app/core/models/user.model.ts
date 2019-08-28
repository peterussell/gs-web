import { Product } from "./product.model";
import { CognitoUser } from "amazon-cognito-identity-js";
import { QuestionSet } from "./question-set.model";
import { ApiService } from "../services/api.service";
import { Course } from "./course.model";
import { Subject } from "./subject.model";
import { Topic } from "./topic.model";
import { SubscriptionInfo } from "./subscription-info.model";

export class User {
    public CognitoUser: CognitoUser;
    public MemberId: string;
    public Name: string;
    public OrganisationId: string;
    public SubscriptionInfo: SubscriptionInfo;
    public QuestionSets: Array<QuestionSet>;

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

        // tmp: probably want a custom object like SubscriptionInfo
        this.QuestionSets = profileData['QuestionSets'];
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
        // A review set is a question set with type 'r' (for 'review')
        if (this.QuestionSets === undefined || this.QuestionSets.length === 0) {
            return;
        }
        return this.QuestionSets.find(qs => qs.Type === this._reviewSetKey);
    }

    updateReviewSet(questionIds: Array<string>) {
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
            this.QuestionSets.push(tmpqs);
        }
        this.getReviewSet().QuestionIds = questionIds;
    }
}