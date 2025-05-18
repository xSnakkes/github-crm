import { Sidebar } from "features/sidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 transition-all md:ml-14 lg:ml-64">
        {children}
      </main>
    </div>
  );
};
