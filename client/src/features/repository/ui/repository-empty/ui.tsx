import { Button } from "shared/ui";
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  onAddClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-8 text-center">
      <h2 className="text-xl font-semibold mb-2">No repositories found</h2>
      <p className="text-muted-foreground mb-6">
        Add your first GitHub repository to get started with tracking.
      </p>
      <Button onClick={onAddClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Repository
      </Button>
    </div>
  );
};
