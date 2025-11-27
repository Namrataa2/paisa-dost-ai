import { Bell, Moon, User } from "lucide-react";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm">
            <option>English</option>
            <option>हिंदी</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Moon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
