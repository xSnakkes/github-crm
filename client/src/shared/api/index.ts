import { ApiClient, AuthApi, RepositoryApi } from "./lib";

const apiClient = new ApiClient(import.meta.env.VITE_API_URL);

export const repositoryApi = new RepositoryApi(apiClient);
export const authApi = new AuthApi(apiClient);
export * from "./lib";
