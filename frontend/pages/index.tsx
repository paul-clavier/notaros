import { Page } from "@/components/Page";
import { ThemeButton } from "@paul-clavier/mugiwara";
import { Lato } from "next/font/google";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const inter = Lato({ weight: "400", subsets: ["latin"] });

export default function Home() {
    const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>{t("generic.title")}</title>
            </Head>
            <main className={`${inter.className}`}>
                <Page>
                    <span>Bonjour</span>
                    <ThemeButton />
                </Page>
            </main>
        </>
    );
}
