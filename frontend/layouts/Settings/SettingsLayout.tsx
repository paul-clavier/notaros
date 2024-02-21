import { signOut } from "@/api/user";
import { buildError } from "@/api/utils/errors";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ThemeButton } from "@/components/ui/ThemeButton";
import { useSetUser } from "@/context/user";
import { Button } from "@paul-clavier/mugiwara";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SettingsLayout.module.css";

const useSignOut = () => {
    const setUser = useSetUser();
    const { push } = useRouter();
    const [error, setError] = useState("");

    const signOutAction = async () => {
        const response = await signOut();
        if (!response.ok) {
            const error = await buildError(response);
            setError(error);
            return;
        }
        setUser(null);
        push("/sign-in");
    };

    return { signOut: signOutAction, error };
};

const SettingsLayout = () => {
    const { t } = useTranslation();
    const { signOut, error } = useSignOut();

    return (
        <div className={styles.root}>
            <h1>{t("pages.settings.title")}</h1>
            <div className={styles.section}>
                <h3>{t("pages.settings.themeTitle")}</h3>
                <ThemeButton />
            </div>
            <div className={styles.section}>
                {error ? <ErrorMessage description={error} /> : null}
                <Button onClick={signOut} className={styles.signOut}>
                    {t("pages.settings.signOut")}
                </Button>
            </div>
        </div>
    );
};

export default SettingsLayout;
