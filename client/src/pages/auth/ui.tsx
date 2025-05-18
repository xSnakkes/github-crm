import { useAuthStore } from "entities/user";
import { Book } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "shared/ui/card";
import { Auth } from "widgets/auth";

export const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Book className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-4 text-2xl font-bold">GitHub CRM</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Your powerful GitHub collaboration tool
          </p>
        </div>

        <Card className="p-6 shadow-lg border-0">
          <Auth />
        </Card>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          By continuing, you agree to our{" "}
          <button className="underline underline-offset-2 hover:text-primary">
            Terms of Service
          </button>{" "}
          and{" "}
          <button className="underline underline-offset-2 hover:text-primary">
            Privacy Policy.
          </button>
        </p>
      </div>
    </div>
  );
};
