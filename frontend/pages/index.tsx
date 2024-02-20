import { Page } from "@/components/layout/Page";
import { useOptionalUser } from "@/context/user";
import Head from "next/head";
import { useTranslation } from "react-i18next";

export default function Home() {
    const { t } = useTranslation();
    const user = useOptionalUser();
    return (
        <>
            <Head>
                <title>{t("generic.title")}</title>
            </Head>
            <Page>
                <span>
                    Bonjour {user?.firstName} {user?.lastName}
                </span>
            </Page>
        </>
    );
}
