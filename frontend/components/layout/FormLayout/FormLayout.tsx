import { ReactNode } from "react";
import styles from "./FormLayout.module.css";

const FormLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className={styles.root}>
            <div className={styles.container}>{children}</div>
        </div>
    );
};

export default FormLayout;
