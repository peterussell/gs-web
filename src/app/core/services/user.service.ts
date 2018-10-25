import { Injectable } from "@angular/core";
import { AuthenticateUserResult, AuthenticateUserResultStatus } from "./authenticate-user.result";
import { RegisterUserResult, RegisterUserResultStatus } from "./register-user.result";
import { Auth } from "aws-amplify";
import { ApiService } from "./api.service";
import { Observable } from "rxjs/Observable";
import { RegisterInterestResponse } from "./interfaces/register-interest-response";
import { CognitoUser } from "amazon-cognito-identity-js";
import { User } from "../models/user.model";

@Injectable()
export class UserService {
    private currentUser: User = null;

    constructor(private apiService: ApiService) {}

    authenticateUser(email: string, password: string): Promise<any> {
        return Auth.signIn(email, password);
    }

    getCurrentUser(): User {
        return this.currentUser;
    }

    setCurrentUser(cognitoUser: CognitoUser) {
        this.currentUser = new User(cognitoUser);
    }

    isAuthenticated(): boolean {
        return this.currentUser === null;
    }

    registerUser(email: string, password: string): Promise<any> {
        return Auth.signUp({
            username: email,
            password: password
        });
    }

    activateUser(email: string, code: string): Promise<any> {
        return Auth.confirmSignUp(email, code);
    }

    sendPasswordResetCode(email: string): Promise<any> {
        return Auth.forgotPassword(email);
    }

    resetPassword(email: string, code: string, password: string): Promise<any> {
        return Auth.forgotPasswordSubmit(email, code, password);
    }

    registerInterest(email: string): Observable<RegisterInterestResponse> {
        return this.apiService.registerInterest(email);
    }
}
