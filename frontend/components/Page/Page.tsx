import classnames from "classnames";
import { ReactNode } from "react";
import { Navigation } from "../Navigation";
import styles from "./Page.module.css";

interface PageProps {
    children: ReactNode;
    rootClassName?: string;
    bodyClassName?: string;
}

const Page = ({ children, rootClassName, bodyClassName }: PageProps) => {
    return (
        <div className={classnames(rootClassName, styles.root)}>
            <Navigation />
            <div className={bodyClassName}>{children}</div>
        </div>
    );
};

export default Page;
