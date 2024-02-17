import { signUpUser } from "@/api/user";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
} from "@paul-clavier/mugiwara";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import styles from "./SignUp.module.css";

// TODO: Move to dtos
// Think of a way to communicate translation here.
const signUpFormSchema = z.object({
    firstName: z.string().min(1, { message: "form.errors.required" }).max(50),
    lastName: z.string().min(1, { message: "form.errors.required" }).max(50),
    email: z.string().min(1, { message: "form.errors.required" }).email(),
    password: z.string().min(8).max(30),
});

type SignUpForm = z.infer<typeof signUpFormSchema>;

const SignUpForm = () => {
    const { t } = useTranslation();
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

    // Wait for server response. If error, display it (find how with react-hook-form). Else:
    // create a useSignUp hook which sets the user in local Storage and completes the signIn
    // Then redirect to homepage and show a Modal "Welcome to Notaros" (by checking if previous page was signUp)
    const onSubmit = async (values: SignUpForm) => {
        await signUpUser(values);
        //push("/");
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={styles.form}
            >
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {t("pages.signUp.form.firstName")}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder={t(
                                        "pages.signUp.form.placeholders.firstName",
                                    )}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage t={t} />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {t("pages.signUp.form.lastName")}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder={t(
                                        "pages.signUp.form.placeholders.lastName",
                                    )}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage t={t} />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {t("pages.signUp.form.email")}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder={t(
                                        "pages.signUp.form.placeholders.email",
                                    )}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage t={t} />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {t("pages.signUp.form.password")}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder={t(
                                        "pages.signUp.form.placeholders.password",
                                    )}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">{t("form.submit")}</Button>
            </form>
        </Form>
    );
};

const SignUpLayout = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <h1>{t("pages.signUp.title")}</h1>
                <SignUpForm />
            </div>
        </div>
    );
};

export default SignUpLayout;
