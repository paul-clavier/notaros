import { API_URL } from "@/pages/_constants";

interface RequestArguments {
    url: string;
    method: "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string | FormData;
}

export interface TypedResponse<T = object> extends Response {
    json(): Promise<T>;
}

export const refreshTokens = () => {
    return fetch(`${API_URL}/auth/refreshTokens`, {
        method: "POST",
        credentials: "include",
    });
};

export const request = async <T>({
    url,
    method,
    body,
}: RequestArguments): Promise<TypedResponse<T>> => {
    const headers: Record<string, string> = {};
    if (typeof body === "string") {
        headers["Content-Type"] = "application/json";
    }

    return fetch(`${API_URL}/${url}`, {
        method,
        body,
        headers,
        credentials: "include", // https://stackoverflow.com/questions/36824106/express-doesnt-set-a-cookie
    }).then(async (response) => {
        if (response.status === 401) {
            const resfreshResponse = await refreshTokens();
            if (resfreshResponse.ok) return request<T>({ url, method, body });
        }
        return response;
    });
};
