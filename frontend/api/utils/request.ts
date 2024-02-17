import { API_URL } from "@/pages/_constants";

interface requestArguments {
    url: string;
    method: "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string | FormData;
}

export interface TypedResponse<T = object> extends Response {
    json(): Promise<T>;
}

export const request = async <T>({
    url,
    method,
    body,
}: requestArguments): Promise<TypedResponse<T>> => {
    const headers: Record<string, string> = {};
    if (typeof body === "string") {
        headers["Content-Type"] = "application/json";
    }

    return fetch(`${API_URL}/${url}`, { method, body, headers });
};
