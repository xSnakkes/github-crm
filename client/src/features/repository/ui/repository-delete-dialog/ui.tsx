import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "shared/ui";
import { Trash2 } from "lucide-react";

interface DeleteRepositoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  repositoryName: string;
}

export const DeleteRepositoryDialog: React.FC<DeleteRepositoryDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  repositoryName,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{repositoryName}</span>? This action
            cannot be undone and will remove the repository from your tracking
            list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="gap-1 ml-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
