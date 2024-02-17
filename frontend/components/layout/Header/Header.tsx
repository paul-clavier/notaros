import { useOptionalUser } from "@/context/user";
import { CogIcon, useTheme } from "@paul-clavier/mugiwara";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import IconButton from "../../ui/IconButton/IconButton";
import styles from "./Header.module.css";

const Header = () => {
    const { t } = useTranslation();
    const { themeClass } = useTheme();
    const user = useOptionalUser();
    return (
        <div className={styles.root}>
            <Link href="/" className={styles.logo}>
                <Image
                    height="42"
                    width="42"
                    src={`/notaros.${themeClass}.png`}
                    alt="Notaros logo"
                />
                <h2>{t("generic.title")}</h2>
            </Link>
            {user ? (
                <Link href="/settings" className={styles.settings}>
                    <IconButton>
                        <CogIcon />
                    </IconButton>
                </Link>
            ) : null}
        </div>
    );
};

export default Header;
