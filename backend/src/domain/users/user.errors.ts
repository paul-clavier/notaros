import { ObjectNotFoundError } from "@/utils/error";

interface UserIdentifier {
    id: number;
    email: string;
}

export class UserNotFoundError extends ObjectNotFoundError<
    Partial<UserIdentifier>
> {
    constructor({ id, email }: Partial<UserIdentifier>) {
        super("User", { id, email });
    }
}

export class UserAlreadyExists extends Error {
    constructor(email: string) {
        super(`User with email: ${email} already exists`);
    }
}
