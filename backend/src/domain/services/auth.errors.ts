export class WrongCredentialsError extends Error {
    constructor() {
        super("The credentials you provided do not allow to authenticate you");
    }
}
