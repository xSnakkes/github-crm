export interface Repository {
  id: number;
  owner: string;
  name: string;
  fullName: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: number;
}

export interface RepositoryFormValues {
  repositoryPath: string;
}

export interface SearchRepositoryOption {
  value: string;
  label: string;
  stars?: number;
  description?: string | null;
  avatar?: string;
}
