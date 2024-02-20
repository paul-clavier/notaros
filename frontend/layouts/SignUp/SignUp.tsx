import { ErrorMessage } from "@/components/ErrorMessage";
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
import { useTranslation } from "react-i18next";
import styles from "./SignUp.module.css";
import { useSignUp } from "./useSignUp";

const SignUpForm = () => {
    const { t } = useTranslation();
    const { form, onSubmit, control, errors } = useSignUp();

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className={styles.form}>
                {errors.root ? (
                    <ErrorMessage description={errors.root.message} />
                ) : null}
                <FormField
                    control={control}
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
                    control={control}
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
                    control={control}
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
                    control={control}
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
