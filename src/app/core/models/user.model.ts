import { Product } from "./product.model";
import { CognitoUser } from "amazon-cognito-identity-js";
import { QuestionSet } from "./question-set.model";
import { ApiService } from "../services/api.service";

export class User {
    public CognitoUser: CognitoUser;
    public MemberId: string;
    public Name: string;
    public OrganisationId: string;
    public ProductInfo: ProductInfo;
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
        this.ProductInfo = new ProductInfo(profileData['ProductInfo']);
        this.QuestionSets = profileData['QuestionSets'];
    }

    getCognitoUsername(): string {
        return this.CognitoUser['username'];
    }

    getReviewSet() {
        // A review set is a question set with type 'r' (for 'review')
        if (this.QuestionSets === undefined || this.QuestionSets.length === 0) {
            return;
        }
        return this.QuestionSets.find(qs => qs.Type === this._reviewSetKey);
    }

    updateReviewSet(questionIds: Array<string>) {
        this.getReviewSet().QuestionIds = questionIds;
    }
}

export class ProductInfo {
    public ActiveProducts: Array<Product>;
    public ProductExpiryDate: string;

    constructor(productData?: any) {
        this.ActiveProducts = new Array<Product>();
        if (productData === undefined) { return; }

        this.ActiveProducts = productData['ActiveProducts'];
        this.ProductExpiryDate = productData['ProductExpiryDate'];
    }
}