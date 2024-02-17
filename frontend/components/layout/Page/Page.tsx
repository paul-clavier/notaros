import classnames from "classnames";
import { ReactElement, ReactNode } from "react";
import { Header } from "../Header";
import { Navigation } from "../Navigation";
import styles from "./Page.module.css";

interface PageProps {
    header?: ReactElement;
    footer?: ReactElement;
    children: ReactNode;
    rootClassName?: string;
    bodyClassName?: string;
    className?: string;
}

const Page = ({
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
            <div className={styles.menu}>
                <Navigation />
            </div>
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

export default Page;
