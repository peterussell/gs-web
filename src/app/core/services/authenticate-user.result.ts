export class AuthenticateUserResult {
    constructor(public status: AuthenticateUserResultStatus, public errorMessage: string = "") {}
}

export enum AuthenticateUserResultStatus {
    Success,
    Error
}