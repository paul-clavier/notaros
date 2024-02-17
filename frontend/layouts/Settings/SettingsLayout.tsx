import { ThemeButton } from "@/components/ui/ThemeButton";
import { useTranslation } from "react-i18next";
import styles from "./SettingsLayout.module.css";

const SettingsLayout = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.root}>
            <h1>{t("pages.settings.title")}</h1>
            <div className={styles.section}>
                <h3>{t("pages.settings.themeTitle")}</h3>
                <ThemeButton className={styles.button} />
            </div>
        </div>
    );
};

export default SettingsLayout;
