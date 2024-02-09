import { buildError } from "@/api/utils/errors";
import { Language } from "@/translation";
import { ReactNode } from "react";
import { SWRConfig as DefaultSWRConfig, SWRConfiguration } from "swr";
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

const fetcher = (language: Language) => async (url: string) => {
    const headers: Record<string, string> = { "Accept-Language": language };
    const response = await fetch(url, { headers });

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
    const userOptions = useUserOptions();
    const swrOptions: SWRConfiguration = {
        onError: (error) => {
            // eslint-disable-next-line no-console
            console.log({ error });
            return error;
        },
        shouldRetryOnError: false,
        fetcher: fetcher(userOptions.language),
    };

    return <DefaultSWRConfig value={swrOptions}>{children}</DefaultSWRConfig>;
};
