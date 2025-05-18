import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Star, Search, Loader2 } from "lucide-react";
import { RepositoryFormValues, repositorySchema } from "./lib";
import { useRepositoryStore } from "entities/repository";
import { Button } from "shared/ui/button";
import { Input } from "shared/ui/input";
import { Label } from "shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  Alert,
  AlertDescription,
} from "shared/ui";
import { useDebounce } from "shared/lib";

interface AddRepositoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddRepositoryDialog: React.FC<AddRepositoryDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    addRepository,
    errors,
    isLoading,
    clearErrors,
    searchRepositories,
    searchOptions,
    isSearching,
  } = useRepositoryStore();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [skipNextSearch, setSkipNextSearch] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors: formErrors },
  } = useForm<RepositoryFormValues>({
    resolver: zodResolver(repositorySchema),
    defaultValues: {
      repositoryPath: "",
    },
  });

  const repositoryPath = watch("repositoryPath");
  const debouncedRepositoryPath = useDebounce(repositoryPath, 300);

  useEffect(() => {
    if (isOpen) {
      clearErrors("add");
    }

    return () => {
      if (!isOpen) {
        clearErrors("add");
      }
    };
  }, [isOpen, clearErrors]);

  useEffect(() => {
    if (skipNextSearch) {
      setSkipNextSearch(false);
      return;
    }

    if (debouncedRepositoryPath && debouncedRepositoryPath.length >= 3) {
      searchRepositories(debouncedRepositoryPath);
      if (!showSuggestions) {
        setShowSuggestions(true);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [
    debouncedRepositoryPath,
    searchRepositories,
    showSuggestions,
    skipNextSearch,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectRepository = (repoPath: string) => {
    setSkipNextSearch(true);
    setValue("repositoryPath", repoPath, { shouldValidate: true });
    clearErrors("add");

    inputRef.current?.focus();
    setShowSuggestions(false);
  };

  const onSubmit = async (data: RepositoryFormValues) => {
    clearErrors("add");

    const success = await addRepository(data.repositoryPath);
    if (success) {
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    clearErrors("add");
    reset();
    setShowSuggestions(false);
    onClose();
  };

  const isWaitingForDebounce =
    repositoryPath.length >= 3 && repositoryPath !== debouncedRepositoryPath;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add GitHub Repository</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        {errors.add && (
          <Alert variant="destructive">
            <AlertDescription>{errors.add}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="repositoryPath">Repository Path</Label>

              <div className="relative">
                <div className="relative">
                  <Input
                    id="repositoryPath"
                    placeholder="facebook/react"
                    {...register("repositoryPath")}
                    className={
                      formErrors.repositoryPath
                        ? "border-destructive pr-10"
                        : "pr-10"
                    }
                    autoComplete="off"
                    ref={(e) => {
                      register("repositoryPath").ref(e);
                      inputRef.current = e;
                    }}
                    onFocus={() => {
                      if (repositoryPath && repositoryPath.length >= 3) {
                        setShowSuggestions(true);
                      }
                    }}
                  />
                  <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {showSuggestions && searchOptions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto"
                  >
                    <ul className="py-1">
                      {searchOptions.map((option) => (
                        <li key={option.value}>
                          <button
                            className="px-3 py-2 w-full hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            onClick={() => handleSelectRepository(option.value)}
                            type="button"
                          >
                            <div className="flex items-center">
                              {option.avatar && (
                                <img
                                  src={option.avatar}
                                  alt={`${option.label} avatar`}
                                  className="w-5 h-5 rounded-full mr-2"
                                />
                              )}
                              <span className="font-medium text-left truncate">
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
                              <p className="text-xs text-left text-muted-foreground truncate mt-1">
                                {option.description}
                              </p>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {showSuggestions &&
                  searchOptions.length === 0 &&
                  !isSearching &&
                  !isWaitingForDebounce &&
                  debouncedRepositoryPath.length >= 3 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md p-3 text-center"
                    >
                      <p className="text-sm text-muted-foreground">
                        No repositories found
                      </p>
                    </div>
                  )}
              </div>

              {formErrors.repositoryPath && (
                <p className="text-sm text-destructive mt-1">
                  {formErrors.repositoryPath.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Enter the path to the GitHub repository (e.g., facebook/react)
                or select from search results
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Repository"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
