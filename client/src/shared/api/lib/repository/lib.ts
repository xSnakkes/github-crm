import type { IApiClient } from "..";
import type {
  IRepositoryResponse,
  IAddRepositoryRequest,
  IGitHubRepositorySearchResponse,
  IRepositorySearchParams,
  IRepositoryDTO,
} from "./model";

export interface IRepositoryApi {
  getRepositories(): Promise<IRepositoryResponse>;
  addRepository(data: IAddRepositoryRequest): Promise<IRepositoryDTO>;
  updateRepository(id: number): Promise<IRepositoryDTO>;
  deleteRepository(id: number): Promise<void>;
  searchGitHubRepositories(
    query: string
  ): Promise<IGitHubRepositorySearchResponse[]>;
}

export class RepositoryApi implements IRepositoryApi {
  private readonly apiClient: IApiClient;
  private readonly baseUrl: string = "/repositories";

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async getRepositories(
    params?: IRepositorySearchParams
  ): Promise<IRepositoryResponse> {
    return await this.apiClient.get<IRepositoryResponse>(
      "/repositories",
      params
    );
  }

  async addRepository(data: IAddRepositoryRequest): Promise<IRepositoryDTO> {
    return this.apiClient.post<IRepositoryDTO>(this.baseUrl, data);
  }

  async updateRepository(id: number): Promise<IRepositoryDTO> {
    return this.apiClient.put<IRepositoryDTO>(
      `${this.baseUrl}/${id}/refresh`,
      {}
    );
  }

  async deleteRepository(id: number): Promise<void> {
    return this.apiClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  async searchGitHubRepositories(
    query: string
  ): Promise<IGitHubRepositorySearchResponse[]> {
    if (!query || query.length < 3) {
      return [];
    }

    return this.apiClient.get<IGitHubRepositorySearchResponse[]>(
      `${this.baseUrl}/search`,
      { query }
    );
  }
}
