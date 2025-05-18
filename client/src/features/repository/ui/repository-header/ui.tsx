import { Button } from "shared/ui";
import { PlusCircle } from "lucide-react";

interface RepositoryHeaderProps {
  onAddClick: () => void;
}

export const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({
  onAddClick,
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">GitHub Repositories</h2>
      <Button onClick={onAddClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Repository
      </Button>
    </div>
  );
};
