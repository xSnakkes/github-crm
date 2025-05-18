import { SearchRepositoryOption } from "entities/repository";
import { Check, Star } from "lucide-react";
import { Skeleton } from "shared/ui";
import { z } from "zod";

export const repositorySchema = z.object({
  repositoryPath: z
    .string()
    .min(3, "Repository path is required")
    .regex(
      /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/,
      "Repository path must be in the format owner/repo"
    ),
});

export type RepositoryFormValues = z.infer<typeof repositorySchema>;

export const renderSuggestions = ({
  repositoryPath,
  limitedSearchOptions,
  isSearching,
  selectedRepoPath,
  handleSelectRepository,
}: {
  repositoryPath: string;
  limitedSearchOptions: SearchRepositoryOption[];
  isSearching: boolean;
  selectedRepoPath: string | null;
  handleSelectRepository: (value: string) => void;
}) => {
  if (!repositoryPath || repositoryPath.length < 3) {
    return null;
  }

  if (isSearching) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Searching repositories...
        </p>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-start w-full p-2 rounded border border-border"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 rounded-full mr-2" />
                <Skeleton className="h-4 w-36" />
                <div className="ml-auto flex items-center">
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <Skeleton className="h-3 w-full mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (limitedSearchOptions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        No repositories found
      </p>
    );
  }

  return (
    <>
      <p className="text-xs text-muted-foreground">Suggestions:</p>
      <div className="space-y-2">
        {limitedSearchOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelectRepository(option.value)}
            className={`flex items-start w-full p-2 rounded border ${
              selectedRepoPath === option.value
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-accent"
            } text-left transition-colors`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                {option.avatar && (
                  <img
                    src={option.avatar}
                    alt={`${option.label} avatar`}
                    className="w-5 h-5 rounded-full mr-2"
                  />
                )}
                <span className="font-medium text-sm truncate">
                  {option.value}
                </span>
                {option.stars !== undefined && (
                  <span className="ml-auto flex items-center text-xs text-muted-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    {option.stars.toLocaleString()}
                  </span>
                )}
              </div>
              {option.description && (
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {option.description}
                </p>
              )}
            </div>
            {selectedRepoPath === option.value && (
              <Check className="h-4 w-4 text-primary ml-2 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </>
  );
};
