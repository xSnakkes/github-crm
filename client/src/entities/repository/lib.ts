import { create } from "zustand";
import { debounce, DebouncedFunc } from "lodash-es";
import { repositoryApi, IRepositorySearchParams } from "shared/api";
import { Repository, SearchRepositoryOption } from "./model";

interface RepositoryState {
  repositories: Repository[];
  searchOptions: SearchRepositoryOption[];
  currentRepository: Repository | null;
  isLoading: boolean;
  isSearching: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  searchQuery: string;
  errors: {
    fetch: string | null;
    add: string | null;
    update: string | null;
    delete: string | null;
    search: string | null;
  };

  fetchRepositories: (params?: IRepositorySearchParams) => Promise<void>;
  addRepository: (path: string) => Promise<boolean>;
  updateRepository: (id: number) => Promise<void>;
  deleteRepository: (id: number) => Promise<void>;
  searchRepositories: DebouncedFunc<(query: string) => Promise<void>>;
  setCurrentRepository: (repository: Repository | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchQuery: (query: string) => void;
  clearErrors: (
    type?: "fetch" | "add" | "update" | "delete" | "search" | "all"
  ) => void;
}

export const useRepositoryStore = create<RepositoryState>((set, get) => ({
  repositories: [],
  searchOptions: [],
  currentRepository: null,
  isLoading: false,
  isSearching: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  searchQuery: "",
  errors: {
    fetch: null,
    add: null,
    update: null,
    delete: null,
    search: null,
  },

  fetchRepositories: async (params?: IRepositorySearchParams) => {
    try {
      set({ isLoading: true });
      set((state) => ({ errors: { ...state.errors, fetch: null } }));

      const currentState = get();
      const queryParams: IRepositorySearchParams = {
        page: params?.page ?? currentState.pagination.page,
        limit: params?.limit ?? currentState.pagination.limit,
        search: params?.search ?? currentState.searchQuery,
      };

      const response = await repositoryApi.getRepositories(queryParams);

      const convertedRepositories = response.items.map((repo) => ({
        ...repo,
        fullName: repo.full_name,
        openIssues: repo.open_issues,
        createdAt: new Date(repo.created_at).getTime(),
      }));

      set({
        repositories: convertedRepositories,
        isLoading: false,
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
        },
      });
    } catch (error: any) {
      set((state) => ({
        errors: {
          ...state.errors,
          fetch:
            error.response?.data?.message ?? "Failed to fetch repositories",
        },
        isLoading: false,
      }));
    }
  },

  setPage: (page: number) => {
    set((state) => {
      const newPage = page;
      get().fetchRepositories({ page: newPage });
      return {
        pagination: {
          ...state.pagination,
          page: newPage,
        },
      };
    });
  },

  setLimit: (limit: number) => {
    set((state) => {
      get().fetchRepositories({ page: 1, limit });
      return {
        pagination: {
          ...state.pagination,
          page: 1,
          limit,
        },
      };
    });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().fetchRepositories({ page: 1, search: query });
  },

  addRepository: async (path: string) => {
    try {
      set((state) => ({
        isLoading: true,
        errors: { ...state.errors, add: null },
      }));

      const newRepository = await repositoryApi.addRepository({ path });
      const convertedRepository = {
        ...newRepository,
        fullName: newRepository.full_name,
        openIssues: newRepository.open_issues,
        createdAt: new Date(newRepository.created_at).getTime(),
      };

      set((state) => ({
        repositories: [...state.repositories, convertedRepository],
        isLoading: false,
      }));

      return true;
    } catch (error: any) {
      set((state) => ({
        errors: {
          ...state.errors,
          add: error.response?.data?.message ?? "Failed to add repository",
        },
        isLoading: false,
      }));

      return false;
    }
  },

  updateRepository: async (id: number) => {
    try {
      set((state) => ({
        isLoading: true,
        errors: { ...state.errors, update: null },
      }));

      const updatedRepository = await repositoryApi.updateRepository(id);
      const convertedRepository = {
        ...updatedRepository,
        fullName: updatedRepository.full_name,
        openIssues: updatedRepository.open_issues,
        createdAt: new Date(updatedRepository.created_at).getTime(),
      };

      set((state) => ({
        repositories: state.repositories.map((repo) =>
          repo.id === convertedRepository.id ? convertedRepository : repo
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set((state) => ({
        errors: {
          ...state.errors,
          update:
            error.response?.data?.message ?? "Failed to update repository",
        },
        isLoading: false,
      }));
    }
  },

  deleteRepository: async (id: number) => {
    try {
      set((state) => ({
        isLoading: true,
        errors: { ...state.errors, delete: null },
      }));

      await repositoryApi.deleteRepository(id);

      set((state) => ({
        repositories: state.repositories.filter((repo) => repo.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set((state) => ({
        errors: {
          ...state.errors,
          delete:
            error.response?.data?.message ?? "Failed to delete repository",
        },
        isLoading: false,
      }));
    }
  },

  searchRepositories: debounce(async (query: string) => {
    if (!query || query.length < 3) {
      set({ searchOptions: [] });
      return;
    }

    try {
      set({ isSearching: true });
      set((state) => ({ errors: { ...state.errors, search: null } }));

      const searchResults = await repositoryApi.searchGitHubRepositories(query);

      const options = searchResults.map((repo) => ({
        value: repo.full_name,
        label: repo.full_name,
        stars: repo.stargazers_count,
        description: repo.description,
        avatar: repo.owner.avatar_url,
      }));

      set({ searchOptions: options, isSearching: false });
    } catch (error: any) {
      set((state) => ({
        errors: {
          ...state.errors,
          search:
            error.response?.data?.message ?? "Failed to search repositories",
        },
        isSearching: false,
        searchOptions: [],
      }));
    }
  }, 100),

  setCurrentRepository: (repository) => {
    set({ currentRepository: repository });
  },

  clearErrors: (type = "all") => {
    if (type === "all") {
      set({
        errors: {
          fetch: null,
          add: null,
          update: null,
          delete: null,
          search: null,
        },
      });
    } else {
      set((state) => ({
        errors: { ...state.errors, [type]: null },
      }));
    }
  },
}));
