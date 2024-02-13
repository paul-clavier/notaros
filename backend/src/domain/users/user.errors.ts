import { ObjectNotFoundError } from "@/utils/error";

interface UserIdentifier {
    id: number;
    email: string;
}

export class UserNotFoundError extends ObjectNotFoundError<
    Partial<UserIdentifier>
> {
    name = UserNotFoundError.name;
    constructor({ id, email }: Partial<UserIdentifier>) {
        super("User", { id, email });
    }
}

export class UserAlreadyExists extends Error {
    name = UserAlreadyExists.name;
    email: string;
    constructor(email: string) {
        super(`User with email: ${email} already exists`);
        this.email = email;
    }
}

export class OtherError extends Error {
    name = OtherError.name;
    constructor(email: string) {
        super(`User with email: ${email} already exists`);
    }
}
