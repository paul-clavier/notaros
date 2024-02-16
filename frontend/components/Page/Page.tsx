import { CogIcon, useTheme } from "@paul-clavier/mugiwara";
import classnames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import IconButton from "../IconButton/IconButton";
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

const Header = () => {
    const { t } = useTranslation();
    const { themeClass } = useTheme();
    return (
        <div className={styles.header}>
            <Link href="/" className={styles.logo}>
                <Image
                    height="42"
                    width="42"
                    src={`/notaros.${themeClass}.png`}
                    alt="Notaros logo"
                />
                <h2>{t("generic.title")}</h2>
            </Link>
            <Link href="/settings" className={styles.settings}>
                <IconButton>
                    <CogIcon />
                </IconButton>
            </Link>
        </div>
    );
};

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
