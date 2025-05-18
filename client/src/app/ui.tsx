import { AuthProvider } from "./providers/auth";
import { RouterProvider } from "./providers/router";

const AppContent: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider />
    </AuthProvider>
  );
};

export const App = () => <AppContent />;
