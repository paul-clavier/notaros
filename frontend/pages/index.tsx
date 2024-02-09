import { useAlarmSocket } from "@/api/subscription/swr";
import { Page } from "@/components/Page";
import { Lato } from "next/font/google";
import Head from "next/head";

const inter = Lato({ weight: "400", subsets: ["latin"] });

export default function Home() {
    const { data, error } = useAlarmSocket();
    return (
        <>
            <Head>
                <title>Joule muse</title>
            </Head>
            <main className={`${inter.className}`}>
                <Page>
                    <span>Bonjour</span>
                    <span>{data?.name}</span>
                </Page>
            </main>
        </>
    );
}
