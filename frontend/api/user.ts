import { request } from "./utils/request";

// TODO: Remove and use the type from zod
export interface SignUpUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

export const signUpUser = async (body: SignUpUserRequest) => {
    return request<User>({
        url: "auth/signUp",
        body: JSON.stringify(body),
        method: "POST",
    });
};
