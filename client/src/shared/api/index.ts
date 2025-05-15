import { ApiClient, AuthApi } from "./lib";

const apiClient = new ApiClient(import.meta.env.VITE_API_URL);

export const authApi = new AuthApi(apiClient);
export * from "./lib";
