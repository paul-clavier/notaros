import { Page } from "@/components/layout/Page";
import { SettingsLayout } from "@/layouts/Settings";
import Head from "next/head";
import { useTranslation } from "react-i18next";

export default function Settings() {
    const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>{t("generic.title")}</title>
            </Head>
            <Page>
                <SettingsLayout />
            </Page>
        </>
    );
}
