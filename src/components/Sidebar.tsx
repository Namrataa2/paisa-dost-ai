import { Home, Wallet, Bell, Receipt, Users, Calculator, Mic, BookOpen, HelpCircle, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Wallet, label: "Pockets", active: false },
  { icon: Bell, label: "Nudges", active: false },
  { icon: Receipt, label: "Transactions", active: false },
  { icon: Users, label: "Mandali", active: false },
  { icon: Calculator, label: "What-If Simulator", active: false },
  { icon: Mic, label: "Voice Coach", active: false },
  { icon: BookOpen, label: "Finance Literacy", active: false },
  { icon: HelpCircle, label: "Help & Support", active: false },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              Paisa <span className="text-primary">Dost</span>
            </h1>
            <p className="text-xs text-muted-foreground">Your AI Money Coach</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 space-y-1 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
