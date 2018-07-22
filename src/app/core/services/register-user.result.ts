export class RegisterUserResult {
    constructor(public status: RegisterUserResultStatus, public errorMessage: string = "") {}
}

export enum RegisterUserResultStatus {
    Success,
    Error
}