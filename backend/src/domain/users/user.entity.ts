import { Option } from "@/utils/monad";
import { BaseEntity } from "@/utils/types";

export interface User extends BaseEntity {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    refreshToken: Option<string>;
}
