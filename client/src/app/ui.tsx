import { withProviders } from "./providers";
import { RouterProvider } from "./providers/router";

export const App: React.FC = () => {
  return withProviders(<RouterProvider />);
};
