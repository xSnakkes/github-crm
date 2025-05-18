import { Input } from "shared/ui";
import { Search } from "lucide-react";

interface RepositoryFiltersProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RepositoryFilters: React.FC<RepositoryFiltersProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative flex-grow max-w-md">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={onSearchChange}
          className="pl-8"
        />
      </div>
    </div>
  );
};
