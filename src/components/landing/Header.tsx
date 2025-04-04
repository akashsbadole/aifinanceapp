import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  calculators: Array<{ name: string; path: string }>;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="fixed top-0 z-50 w-full glass-effect border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-primary">BizNest</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link
            to="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground premium-transition"
          >
            Features
          </Link>
          <Link
            to="#benefits"
            className="text-sm font-medium text-muted-foreground hover:text-foreground premium-transition"
          >
            Benefits
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground premium-transition"
          >
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button className="rounded-full">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
