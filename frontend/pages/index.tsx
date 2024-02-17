import { Page } from "@/components/layout/Page";
import Head from "next/head";
import { useTranslation } from "react-i18next";

export default function Home() {
    const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>{t("generic.title")}</title>
            </Head>
            <Page>
                <span>Bonjour</span>
            </Page>
        </>
    );
}
