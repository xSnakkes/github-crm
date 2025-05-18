export interface IRepositoryDTO {
  id: number;
  owner: string;
  name: string;
  full_name: string;
  url: string;
  stars: number;
  forks: number;
  open_issues: number;
  created_at: number;
}

export interface IAddRepositoryRequest {
  path: string;
}

export interface IGitHubRepositorySearchResponse {
  id: number;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface IRepositorySearchParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface IRepositoryResponse {
  items: IRepositoryDTO[];
  total: number;
  page: number;
  limit: number;
}
