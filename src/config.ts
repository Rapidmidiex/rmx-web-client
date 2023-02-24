const apiBaseUrl = import.meta.env.VITE_RMX_API_BASE ?? 'http://localhost:8000';

export default {
    apiBaseUrl: apiBaseUrl+"/v1",
}as const