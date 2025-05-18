import { formatDistance } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from "shared/ui";
import {
  Star,
  GitFork,
  CircleAlert,
  RefreshCw,
  Trash2,
  Loader2,
} from "lucide-react";
import { Repository } from "entities/repository";

interface RepositoryTableProps {
  repositories: Repository[];
  isLoading: boolean;
  showNoSearchResults: boolean;
  searchQuery: string;
  onUpdate: (id: number) => void;
  onDelete: (id: number) => void;
}

export const RepositoryTable: React.FC<RepositoryTableProps> = ({
  repositories,
  isLoading,
  showNoSearchResults,
  searchQuery,
  onUpdate,
  onDelete,
}) => {
  const renderTableContent = () => {
    if (showNoSearchResults) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-24 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-2">
                No repositories match your search:{" "}
                <span className="font-medium">"{searchQuery}"</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Try another search term or clear the search field
              </p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (repositories.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-24 text-center">
            No repositories found.
          </TableCell>
        </TableRow>
      );
    }

    return repositories.map((repo) => (
      <TableRow key={repo.id}>
        <TableCell className="font-medium">{repo.name}</TableCell>
        <TableCell>{repo.owner}</TableCell>
        <TableCell className="hidden md:table-cell truncate max-w-[200px]">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {repo.url}
          </a>
        </TableCell>
        <TableCell className="text-center">{repo.stars}</TableCell>
        <TableCell className="text-center">{repo.forks}</TableCell>
        <TableCell className="text-center">{repo.openIssues}</TableCell>
        <TableCell className="hidden md:table-cell">
          {formatDistance(new Date(repo.createdAt), new Date(), {
            addSuffix: true,
          })}
        </TableCell>
        <TableCell className="text-right space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdate(repo.id)}
            title="Refresh repository data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(repo.id)}
            title="Delete repository"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="rounded-md border relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Repository</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead className="hidden md:table-cell">URL</TableHead>
            <TableHead className="text-center">
              <Star className="inline h-4 w-4" />
            </TableHead>
            <TableHead className="text-center">
              <GitFork className="inline h-4 w-4" />
            </TableHead>
            <TableHead className="text-center">
              <CircleAlert className="inline h-4 w-4" />
            </TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableContent()}</TableBody>
      </Table>
    </div>
  );
};
