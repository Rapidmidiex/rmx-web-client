const apiBaseUrl = import.meta.env.VITE_RMX_API_BASE ?? "http://localhost:8000";

export const config = {
    apiBaseUrl: apiBaseUrl + "/v0",
} as const;
