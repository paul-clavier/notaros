import { StrictMode } from "react";
// TODO: Find a way to avoid importing this styling file from the app.
// This import should remain above the two others so that css classes from the package can be overriden by the app.
import "@nw-tech/joule-spin/dist/style.css";
import "./constants.css";
import "./globals.css";

import type { AppProps } from "next/app";
import { ThemeProvider } from "@nw-tech/joule-spin";
import dynamic from "next/dynamic";
import "@/translation";
import { UserOptionsProvider } from "@/context/user-options";
import { UserProvider } from "@/context/user";
import { SWRConfig } from "@/context/swr";

const App = ({ Component, pageProps }: AppProps) => {
    return (
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
    );
};

export default dynamic(() => Promise.resolve(App), {
    ssr: false,
});
