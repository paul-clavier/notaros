import { MouseEvent } from "react";
import { Trans } from "react-i18next";
import styles from "./ErrorMessage.module.css";
import {
    Alert,
    AlertDescription,
    AlertTitle,
    TerminalIcon,
} from "@nw-tech/joule-spin";

const UnknownErrorMessage = () => {
    const reload = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        window.location.reload();
    };

    return (
        <div className={styles.root}>
            <Alert variant="destructive" className={styles.alert}>
                <TerminalIcon />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    <Trans
                        i18nKey="components.errorMessage.unknownErrorMessage"
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

export default UnknownErrorMessage;
