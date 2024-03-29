import { StrictMode } from "react";
// TODO: Find a way to avoid importing this styling file from the app.
// This import should remain above the two others so that css classes from the package can be overriden by the app.
import "@paul-clavier/mugiwara/dist/style.css";
import "./constants.css";
import "./globals.css";

import { SWRConfig } from "@/context/swr";
import { UserProvider } from "@/context/user";
import { UserOptionsProvider } from "@/context/user-options";
import "@/translation";
import { ThemeProvider } from "@paul-clavier/mugiwara";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Lato } from "next/font/google";

const inter = Lato({ weight: "400", subsets: ["latin"] });

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <main className={`${inter.className}`}>
            <StrictMode>
                <ThemeProvider>
                    <UserProvider>
                        <UserOptionsProvider>
                            <SWRConfig>
                                <Component {...pageProps} />
                            </SWRConfig>
                        </UserOptionsProvider>
                    </UserProvider>
                </ThemeProvider>
            </StrictMode>
        </main>
    );
};

export default dynamic(() => Promise.resolve(App), {
    ssr: false,
});
