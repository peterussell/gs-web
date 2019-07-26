import { Product } from "./product.model";
import { CognitoUser } from "amazon-cognito-identity-js";

export class User {
    public CognitoUser: CognitoUser;
    public MemberId: string;
    public Name: string;
    public OrganisationId: string;
    public ProductInfo: ProductInfo;

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