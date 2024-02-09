import { Option, Task } from "@/utils/monad";
import { Mutable } from "@/utils/types";
import { User } from "./user.entity";

export interface UserRepository {
    findUnique(email: string): Task<Option<User>, never>;
    findById(id: number): Promise<User>;
    create(user: Mutable<User>): Task<User, never>;
}
