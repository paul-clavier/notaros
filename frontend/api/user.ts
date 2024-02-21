import { z } from "zod";
import { request } from "./utils/request";
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

// TODO: Move to dtos
// Think of a way to communicate translation here.
export const signUpFormSchema = z.object({
    firstName: z.string().min(1, { message: "form.errors.required" }).max(50),
    lastName: z.string().min(1, { message: "form.errors.required" }).max(50),
    email: z.string().min(1, { message: "form.errors.required" }).email(),
    password: z.string().min(8).max(30),
});

export type SignUpForm = z.infer<typeof signUpFormSchema>;

// TODO: Move to dtos
// Think of a way to communicate translation here.
export const signInFormSchema = z.object({
    email: z.string().min(1, { message: "form.errors.required" }).email(),
    password: z.string().min(8).max(30),
});

export type SignInForm = z.infer<typeof signInFormSchema>;

export const signUp = async (body: SignUpForm) => {
    return request<User>({
        url: "auth/signUp",
        body: JSON.stringify(body),
        method: "POST",
    });
};

export const signIn = async (body: SignInForm) => {
    return request<User>({
        url: "auth/signIn",
        body: JSON.stringify(body),
        method: "POST",
    });
};

export const signOut = async () => {
    return request<void>({
        url: "auth/signOut",
        method: "POST",
    });
};
