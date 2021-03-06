import { Injectable, Output, EventEmitter } from "@angular/core";
import { AuthenticateUserResult, AuthenticateUserResultStatus } from "./authenticate-user.result";
import { RegisterUserResult, RegisterUserResultStatus } from "./register-user.result";
import { Auth } from "aws-amplify";
import { ApiService } from "./api.service";
import { Observable } from "rxjs/Observable";
import { RegisterInterestResponse } from "./interfaces/register-interest-response";
import { CognitoUser } from "amazon-cognito-identity-js";
import { fromPromise } from "rxjs/observable/fromPromise";
import { from } from "rxjs/observable/from";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { User } from "../models/user.model";
import { Router } from "@angular/router";

@Injectable()
export class UserService {
    private _currentUserBS: BehaviorSubject<User> = new BehaviorSubject(null);
    public readonly currentUser$: Observable<User> = this._currentUserBS.asObservable();

    private _currentUser: User;

    constructor(
        private apiService: ApiService,
        private router: Router) {
        from(Auth.currentAuthenticatedUser()).subscribe(
            (cognitoUser: CognitoUser) => {
                this.getProfile(cognitoUser['username']).subscribe((profileData) => {
                    const user = new User(cognitoUser, profileData);
                    this._currentUser = user;

                    // Notify subscribers
                    this.setCurrentUser(user);
                });
            },
            (error: any) =>
            {
                // 'Not authenticated' returns as an error, so don't log errors for now.
            }
        );
    }

    signIn(email: string, password: string): Observable<CognitoUser> {
        return from(Auth.signIn(email, password));
    }

    signOut() {
        from(Auth.signOut()).subscribe(
            () => {
                this.setCurrentUser(null);
                this.router.navigate(['/signed-out'])
            },
            (error: any) => { console.log(error); } // tmp - TODO: log this properly or show an error
        );
    }

    getCurrentUser() {
        return this._currentUser;
    }

    setCurrentUser(user: User) {
        this._currentUserBS.next(user);
    }

    // TODO: convert to observable
    registerUser(email: string, password: string): Promise<any> {
        return Auth.signUp({
            username: email,
            password: password
        });
    }

    // TODO: convert to observable
    activateUser(email: string, code: string): Promise<any> {
        return Auth.confirmSignUp(email, code);
    }

    // TODO: convert to obserable
    sendPasswordResetCode(email: string): Promise<any> {
        return Auth.forgotPassword(email);
    }

    // TODO: convert to observable
    resetPassword(email: string, code: string, password: string): Promise<any> {
        return Auth.forgotPasswordSubmit(email, code, password);
    }

    registerInterest(email: string): Observable<RegisterInterestResponse> {
        return this.apiService.registerInterest(email);
    }

    getProfile(userId: string): Observable<any> {
        return this.apiService.getUserProfile(userId);
    }
}
