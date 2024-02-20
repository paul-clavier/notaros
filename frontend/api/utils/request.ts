import { API_URL } from "@/pages/_constants";

interface RequestArguments {
    url: string;
    method: "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string | FormData;
}

export interface TypedResponse<T = object> extends Response {
    json(): Promise<T>;
}

// TODO: Add the cookies if user is authenticated
export const request = async <T>({
    url,
    method,
    body,
}: RequestArguments): Promise<TypedResponse<T>> => {
    const headers: Record<string, string> = {};
    if (typeof body === "string") {
        headers["Content-Type"] = "application/json";
    }

    return fetch(`${API_URL}/${url}`, { method, body, headers });
};
