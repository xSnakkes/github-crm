import { Suspense } from "react";
import { RouterProvider as BaseRouterProvider } from "react-router-dom";
import { router } from "./lib";

export const RouterProvider = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BaseRouterProvider router={router} />
    </Suspense>
  );
};
