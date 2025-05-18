import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "entities/user";
import { Button } from "shared/ui/button";
import { cn } from "shared/lib/utils";
import { Home, LogOut, Menu, X } from "lucide-react";
import Github from "shared/assets/github";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    path: "/",
    label: "Dashboard",
    icon: <Home className="h-5 w-5" />,
  },
];

export const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden w-full flex items-center justify-between p-4 border-b">
        <div className="flex flex-row gap-2 items-center">
          <Github className="h-6 w-6 text-sidebar-foreground" />
          <h1 className="ml-2 text-xl font-bold text-sidebar-foreground">
            GitHub CRM
          </h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar - Desktop & Tablet */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300",
          "md:w-14 lg:w-64 hidden md:flex flex-col",
          "bg-sidebar border-r border-sidebar-border"
        )}
      >
        <div className="hidden lg:flex h-14 items-center justify-center lg:justify-start px-4 border-b border-sidebar-border">
          <Github className="h-6 w-6 text-sidebar-foreground" />
          <h1 className="ml-2 text-xl font-bold hidden lg:block text-sidebar-foreground">
            GitHub CRM
          </h1>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center p-2 rounded-md transition-colors",
                  "text-sidebar-foreground hover:bg-sidebar-accent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  isActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground",
                  "lg:justify-start lg:px-4",
                  "md:justify-center md:px-2"
                )
              }
            >
              {item.icon}
              <span className="ml-3 hidden lg:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 md:mr-0 lg:mr-2" />
            <span className="hidden lg:inline">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-full w-64 bg-sidebar p-4 transition-all transform">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Github className="h-6 w-6 text-sidebar-foreground" />
                <h1 className="ml-2 text-xl font-bold text-sidebar-foreground">
                  GitHub CRM
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center p-3 rounded-md transition-colors",
                      "text-sidebar-foreground hover:bg-sidebar-accent",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                      isActive &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
