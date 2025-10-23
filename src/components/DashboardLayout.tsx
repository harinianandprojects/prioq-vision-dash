import { ReactNode } from "react";
import { Bell, Users, LayoutDashboard, Search, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function DashboardLayout({ children, activeView, onViewChange, onLogout }: DashboardLayoutProps) {
  const menuItems = [
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "customers", label: "Customers", icon: Users },
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-foreground">PrioQ</h1>
          <p className="text-sm text-sidebar-foreground/60 mt-1">Bank Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeView === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elevated"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Button>
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-card">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search customers by ID, name, or phone..."
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@prioq.bank</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">AU</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
