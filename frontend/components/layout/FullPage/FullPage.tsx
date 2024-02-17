import classnames from "classnames";
import { ReactElement, ReactNode } from "react";
import { Header } from "../Header";
import styles from "./FullPage.module.css";

interface PageProps {
    header?: ReactElement;
    footer?: ReactElement;
    children: ReactNode;
    rootClassName?: string;
    bodyClassName?: string;
    className?: string;
}

const FullPage = ({
    footer,
    header,
    children,
    rootClassName,
    bodyClassName,
    className,
}: PageProps) => {
    return (
        <div className={classnames(rootClassName, styles.root)}>
            <Header />
            <div className={classnames(styles.body, bodyClassName)}>
                {header}
                <div className={classnames(className, styles.container)}>
                    {children}
                </div>
                {footer}
            </div>
        </div>
    );
};

export default FullPage;
