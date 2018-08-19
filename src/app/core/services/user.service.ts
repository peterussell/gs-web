import { Injectable } from "@angular/core";
import { AuthenticateUserResult, AuthenticateUserResultStatus } from "./authenticate-user.result";
import { RegisterUserResult, RegisterUserResultStatus } from "./register-user.result";
import { Auth } from "aws-amplify";
import { ApiService } from "./api.service";
import { Observable } from "rxjs/Observable";
import { RegisterInterestResponse } from "./interfaces/register-interest-response";

@Injectable()
export class UserService {
    private readonly u: { u: string, p: string}[] = [
        { 'u': 'gs1', 'p': 'temp_253' },
        { 'u': 'gs2', 'p': 'temp_919' },
        { 'u': 'gs3', 'p': 'temp_564' },
        { 'u': 'gs4', 'p': 'temp_175' },
        { 'u': 'gs5', 'p': 'temp_632' },
        { 'u': 'gs6', 'p': 'temp_255' },
        { 'u': 'gs7', 'p': 'temp_770' },
        { 'u': 'gs8', 'p': 'temp_283' },
        { 'u': 'gs9', 'p': 'temp_186' },
        { 'u': 'gs100', 'p': 'temp_618' },
        { 'u': '100', 'p': 'demo' }
    ];

    constructor(private apiService: ApiService) {}

    authenticateUser(email: string, password: string): Promise<any> {
        return Auth.signIn(email, password);
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
