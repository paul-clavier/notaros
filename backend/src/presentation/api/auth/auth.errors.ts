export class WrongPasswordError extends Error {
    name = WrongPasswordError.name;
    constructor(email: string) {
        super(`Password for user ${email} is not correct`);
    }
}

export class WrongRefreshTokenError extends Error {
    name = WrongRefreshTokenError.name;
    constructor(userId: number) {
        super(`Refresh token for user ${userId} is not correct`);
    }
}
