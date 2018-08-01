import { Injectable } from "@angular/core";
import { AuthenticateUserResult, AuthenticateUserResultStatus } from "./authenticate-user.result";
import { RegisterUserResult, RegisterUserResultStatus } from "./register-user.result";
import { Auth } from "aws-amplify";

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

    // authenticateUser(email: string, password: string): AuthenticateUserResult {
    //     if (email === null || password === null) {
    //         return new AuthenticateUserResult(AuthenticateUserResultStatus.Error, "Null username or password.");
    //     }

    //     // tmp until AWS is working
    //     for(let i=0; i< this.u.length; i++) {
    //         if (this.u[i]['u'] === email.toLowerCase()&& this.u[i]['p'] === password.toLowerCase()) {
    //             return new AuthenticateUserResult(AuthenticateUserResultStatus.Success);
    //         }
    //     }
    //     return new AuthenticateUserResult(
    //         AuthenticateUserResultStatus.Error, "No matching username/password combination found."
    //     );
    // }

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

    resetPassword(email: string): boolean {
        console.log('UserService: resetPassword called but not implemented.');
        return true;
    }
}