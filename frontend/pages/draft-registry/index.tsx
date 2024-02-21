import { Page } from "@/components/layout/Page";
import Head from "next/head";
import { useTranslation } from "react-i18next";

//https://tanstack.com/table/v8/docs/framework/react/examples/editable-data?from=reactTableV7
//Then https://www.youtube.com/watch?v=CjqG277Hmgg
export default function Settings() {
    const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>{t("generic.title")}</title>
            </Head>
            <Page>
                <h1>Draft registry</h1>
            </Page>
        </>
    );
}
