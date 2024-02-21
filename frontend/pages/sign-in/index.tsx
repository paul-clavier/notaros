import { FullPage } from "@/components/layout/FullPage";
import { SignInLayout } from "@/layouts/SignIn";
import Head from "next/head";
import { useTranslation } from "react-i18next";

export default function Home() {
    const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>{t("generic.title")}</title>
            </Head>
            <FullPage>
                <SignInLayout />
            </FullPage>
        </>
    );
}
