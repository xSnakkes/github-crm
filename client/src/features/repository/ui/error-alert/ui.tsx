import { Alert, AlertDescription, Button } from "shared/ui";
import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  error: string;
  onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss }) => {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <div className="flex justify-between w-full items-center">
        <AlertDescription>{error}</AlertDescription>
        <Button
          variant="outline"
          size="sm"
          onClick={onDismiss}
          className="ml-2 bg-transparent hover:bg-destructive/10"
        >
          Dismiss
        </Button>
      </div>
    </Alert>
  );
};
