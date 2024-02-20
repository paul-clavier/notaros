import {
    Alert,
    AlertDescription,
    AlertTitle,
    TerminalIcon,
} from "@paul-clavier/mugiwara";
import { MouseEvent } from "react";
import { Trans, useTranslation } from "react-i18next";
import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
    className?: string;
    title?: string;
    description?: string;
}

export const ErrorMessage = ({ title, description }: ErrorMessageProps) => {
    const { t } = useTranslation();
    const reload = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        window.location.reload();
    };

    return (
        <div className={styles.root}>
            <Alert variant="destructive" className={styles.alert}>
                <TerminalIcon />
                <AlertTitle>{title ?? t("components.errorTitle")}</AlertTitle>
                <AlertDescription>
                    {description ?? (
                        <Trans
                            i18nKey="components.errorMessage"
                            components={{
                                button: (
                                    <a
                                        href="#"
                                        onClick={reload}
                                        role="button"
                                    />
                                ),
                            }}
                        />
                    )}
                </AlertDescription>
            </Alert>
        </div>
    );
};

export const UnknownErrorMessage = () => {
    const { t } = useTranslation();
    const reload = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        window.location.reload();
    };

    return (
        <div className={styles.root}>
            <Alert variant="destructive" className={styles.alert}>
                <TerminalIcon />
                <AlertTitle>{t("components.errorTitle")}</AlertTitle>
                <AlertDescription>
                    <Trans
                        i18nKey="components.errorMessage"
                        components={{
                            button: (
                                <a href="#" onClick={reload} role="button" />
                            ),
                        }}
                    />
                </AlertDescription>
            </Alert>
        </div>
    );
};
