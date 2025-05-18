import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Search, Loader2 } from "lucide-react";
import {
  renderSuggestions,
  RepositoryFormValues,
  repositorySchema,
} from "./lib";
import { useRepositoryStore } from "entities/repository";
import { useDebounce } from "shared/lib/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  Alert,
  AlertDescription,
  Button,
  Input,
  Label,
} from "shared/ui";

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

  const [selectedRepoPath, setSelectedRepoPath] = useState<string | null>(null);
  const [skipNextSearch, setSkipNextSearch] = useState(false);
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
  // Apply debounce with 300ms delay
  const debouncedRepositoryPath = useDebounce(repositoryPath, 300);

  useEffect(() => {
    if (repositoryPath) {
      const matchingSuggestion = searchOptions.find(
        (option) => option.value === repositoryPath
      );

      if (matchingSuggestion) {
        setSelectedRepoPath(repositoryPath);
      } else {
        setSelectedRepoPath(null);
      }
    } else {
      setSelectedRepoPath(null);
    }
  }, [repositoryPath, searchOptions]);

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
    }
  }, [debouncedRepositoryPath, searchRepositories, skipNextSearch]);

  const handleSelectRepository = (repoPath: string) => {
    setValue("repositoryPath", repoPath, { shouldValidate: true });
    clearErrors("add");
    setSelectedRepoPath(repoPath);
    setSkipNextSearch(true);
    inputRef.current?.focus();
  };

  const onSubmit = async (data: RepositoryFormValues) => {
    clearErrors("add");

    const success = await addRepository(data.repositoryPath);
    if (success) {
      reset();
      setSelectedRepoPath(null);
      onClose();
    }
  };

  const handleClose = () => {
    clearErrors("add");
    reset();
    setSelectedRepoPath(null);
    onClose();
  };

  const limitedSearchOptions = searchOptions.slice(0, 3);

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
                />
                <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {formErrors.repositoryPath && (
                <p className="text-sm text-destructive mt-1">
                  {formErrors.repositoryPath.message}
                </p>
              )}

              {debouncedRepositoryPath &&
                debouncedRepositoryPath.length >= 3 && (
                  <div className="mt-3 space-y-2 max-w-[320px]">
                    {renderSuggestions({
                      repositoryPath: debouncedRepositoryPath,
                      limitedSearchOptions,
                      isSearching,
                      selectedRepoPath,
                      handleSelectRepository,
                    })}
                  </div>
                )}

              <p className="text-sm text-muted-foreground">
                Enter the path to the GitHub repository (e.g., facebook/react)
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
