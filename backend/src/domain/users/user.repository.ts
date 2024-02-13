import { Option, Task } from "@/utils/monad";
import { Mutable } from "@/utils/types";
import { User } from "./user.entity";
import { UserNotFoundError } from "./user.errors";

export interface UserRepository {
    findUnique(email: string): Task<Option<User>, Error>;
    findUniqueOrThrow(email: string): Task<User, Error | UserNotFoundError>;
    findByIdOrThrow(id: number): Task<User, Error | UserNotFoundError>;
    create(user: Mutable<User>): Task<User, Error>;
    updateRefreshToken(
        userId: number,
        refreshToken: string | null,
    ): Task<User, Error>;
}
