import { CognitoUser } from "amazon-cognito-identity-js";

export class User {
    id: string;
    email: string;

    constructor(cognitoUser: CognitoUser) {
        // TODO: working here - save the user to local storage?
        console.log('User logged in...');
        console.log(cognitoUser);
    }
}