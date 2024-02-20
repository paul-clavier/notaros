import { signUpUser } from "@/api/user";
import { buildError } from "@/api/utils/errors";
import { useSetUser } from "@/context/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

// TODO: Move to dtos
// Think of a way to communicate translation here.
const signUpFormSchema = z.object({
    firstName: z.string().min(1, { message: "form.errors.required" }).max(50),
    lastName: z.string().min(1, { message: "form.errors.required" }).max(50),
    email: z.string().min(1, { message: "form.errors.required" }).email(),
    password: z.string().min(8).max(30),
});

type SignUpForm = z.infer<typeof signUpFormSchema>;

export const useSignUp = () => {
    const setUser = useSetUser();
    const { push } = useRouter();
    const form = useForm<SignUpForm>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    const submit = async (values: SignUpForm) => {
        const response = await signUpUser(values);
        if (!response.ok) {
            const error = await buildError(response);
            form.setError("root", { message: error });
            return;
        }
        const user = await response.json();
        setUser(user);
        push("/");
    };

    const onSubmit = form.handleSubmit(submit);

    return {
        form,
        control: form.control,
        errors: form.formState.errors,
        onSubmit,
        handleSubmit: form.handleSubmit,
    };
};
