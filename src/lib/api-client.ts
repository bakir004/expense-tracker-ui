const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_VERSION = import.meta.env.VITE_API_VERSION || "v1";

interface ApiOptions extends RequestInit {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>;
}

const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
};

export async function apiClient<T>(
    endpoint: string,
    { body, method, params, ...customConfig }: ApiOptions = {},
): Promise<T> {
    const token = getCookie("jwt");

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let queryString = "";
    if (params) {
        const cleanParams = Object.fromEntries(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(params).filter(([_, v]) => v != null)
        );
        const searchParams = new URLSearchParams(cleanParams);
        queryString = `?${searchParams.toString()}`;
    }

    const finalMethod = method || (body ? "POST" : "GET");

    const config: RequestInit = {
        method: finalMethod,
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(
        `${BASE_URL}/${API_VERSION}${endpoint}${queryString}`,
        config,
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = {
            status: response.status,
            ...errorData,
        };
        return Promise.reject(error);
    }

    if (response.status === 204) return {} as T;

    return response.json();
}
