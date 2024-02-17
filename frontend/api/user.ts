import { request } from "./utils/request";

// TODO: Remove and use the type from zod
export interface SignUpUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type UserResponse = Omit<SignUpUserRequest, "password">;

export const signUpUser = async (body: SignUpUserRequest) => {
    return request<UserResponse>({
        url: "auth/signUp",
        body: JSON.stringify(body),
        method: "POST",
    });
};
