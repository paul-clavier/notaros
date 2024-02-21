import { ErrorMessage } from "@/components/ErrorMessage";
import { FormLayout } from "@/components/layout/FormLayout";
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
import styles from "./SignIn.module.css";
import { useSignIn } from "./useSignIn";

const SignInForm = () => {
    const { t } = useTranslation();
    const { form, onSubmit, control, errors } = useSignIn();

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className={styles.form}>
                {errors.root ? (
                    <ErrorMessage description={errors.root.message} />
                ) : null}
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

const SignInLayout = () => {
    const { t } = useTranslation();
    return (
        <FormLayout>
            <h1>{t("pages.signIn.title")}</h1>
            <SignInForm />
        </FormLayout>
    );
};

export default SignInLayout;
