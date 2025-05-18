import { useState, useEffect } from "react";
import { useRepositoryStore } from "entities/repository";
import { AddRepositoryDialog } from "features/repository/ui/add-repository";
import { useDebounce } from "shared/lib";
import {
  RepositoryHeader,
  EmptyState,
  RepositoryFilters,
  RepositoryTable,
  RepositoryPagination,
  DeleteRepositoryDialog,
  ErrorAlert,
} from "features/repository";
import { Loader2 } from "lucide-react";

export const RepositoryList = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState<number | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const {
    repositories,
    isLoading,
    errors,
    pagination,
    searchQuery,
    fetchRepositories,
    updateRepository,
    deleteRepository,
    clearErrors,
    setPage,
    setLimit,
    setSearchQuery,
  } = useRepositoryStore();

  const listError = errors.fetch ?? errors.update ?? errors.delete;
  const debouncedSearch = useDebounce(localSearchQuery, 300);
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const handleUpdate = (id: number) => {
    updateRepository(id);
  };

  const handleDeleteClick = (id: number) => {
    setRepoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (repoToDelete) {
      deleteRepository(repoToDelete);
      setDeleteDialogOpen(false);
      setRepoToDelete(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  if (isLoading && repositories.length === 0 && !searchQuery) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const repoToDeleteName = repoToDelete
    ? repositories.find((repo) => repo.id === repoToDelete)?.fullName ??
      "this repository"
    : "";

  const showEmptyState =
    repositories.length === 0 && pagination.total === 0 && !searchQuery;
  const showNoSearchResults = repositories.length === 0 && !!searchQuery;

  return (
    <div className="space-y-6">
      <RepositoryHeader onAddClick={() => setIsAddDialogOpen(true)} />

      {listError && (
        <ErrorAlert error={listError} onDismiss={() => clearErrors()} />
      )}

      <RepositoryFilters
        searchQuery={localSearchQuery}
        onSearchChange={handleSearchChange}
      />

      {showEmptyState ? (
        <EmptyState onAddClick={() => setIsAddDialogOpen(true)} />
      ) : (
        <>
          <RepositoryTable
            repositories={repositories}
            isLoading={isLoading}
            showNoSearchResults={showNoSearchResults}
            searchQuery={searchQuery}
            onUpdate={handleUpdate}
            onDelete={handleDeleteClick}
          />

          {pagination.total > 0 && (
            <RepositoryPagination
              currentPage={pagination.page}
              totalPages={totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onLimitChange={handleLimitChange}
              isLoading={isLoading}
              onPageChange={goToPage}
            />
          )}
        </>
      )}

      <AddRepositoryDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />

      <DeleteRepositoryDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        repositoryName={repoToDeleteName}
      />
    </div>
  );
};
