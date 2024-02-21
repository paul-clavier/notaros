import { buildError } from "@/api/utils/errors";
import { refreshTokens } from "@/api/utils/request";
import { API_URL } from "@/pages/_constants";
import { Language } from "@/translation";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
    SWRConfig as DefaultSWRConfig,
    SWRConfiguration,
    useSWRConfig,
} from "swr";
import { useSetUser } from "./user";
import { useUserOptions } from "./user-options";

interface SWRConfigProps {
    children: ReactNode;
}

class SWRFetchError extends Error {
    status: number;
    details: string;

    constructor(message: string, status: number, details: string) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

const fetcher =
    (language: Language) =>
    async (url: string): Promise<any> => {
        const headers: Record<string, string> = { "Accept-Language": language };
        const response = await fetch(`${API_URL}/${url}`, {
            headers,
            credentials: "include",
        });

        if (!response.ok) {
            const details = await buildError(response, "");
            throw new SWRFetchError(
                `An error occurred while fetching the data: Error ${response.status}`,
                response.status,
                details,
            );
        }

        return response.json();
    };

export const SWRConfig = ({ children }: SWRConfigProps) => {
    const { mutate } = useSWRConfig();
    const userOptions = useUserOptions();
    const setUser = useSetUser();
    const { asPath, push } = useRouter();
    const swrOptions: SWRConfiguration = {
        onErrorRetry: async (
            error,
            key,
            config,
            revalidate,
            revalidateOpts,
        ) => {
            if (error.status === 401) {
                const resfreshResponse = await refreshTokens();
                if (resfreshResponse.ok) return revalidate();

                setUser(null);
                mutate((key) => true, undefined, { revalidate: false });
                push(`sign-in?next=${asPath}`);
            }
            return error;
        },
        fetcher: fetcher(userOptions.language),
    };

    return <DefaultSWRConfig value={swrOptions}>{children}</DefaultSWRConfig>;
};
