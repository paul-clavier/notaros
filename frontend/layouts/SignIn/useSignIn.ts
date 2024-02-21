import { SignInForm, signIn, signInFormSchema } from "@/api/user";
import { buildError } from "@/api/utils/errors";
import { useSetUser } from "@/context/user";
import { getLocalUrl } from "@/utils/url";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export const useSignIn = () => {
    const setUser = useSetUser();
    const { query, push } = useRouter();
    const form = useForm<SignInForm>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const submit = async (values: SignInForm) => {
        const response = await signIn(values);
        if (!response.ok) {
            const error = await buildError(response);
            form.setError("root", { message: error });
            return;
        }
        const user = await response.json();
        const next = getLocalUrl(query.next as string);
        const nextPage = next ?? "/";
        setUser(user);
        push(nextPage);
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
