import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Calculator } from "lucide-react";

interface HeaderProps {
  calculators: Array<{ name: string; path: string }>;
}

const Header: React.FC<HeaderProps> = ({ calculators }) => {
  return (
    <header className="fixed top-0 z-50 w-full glass-effect border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-primary">
            <Link to="/">BizNest</Link>
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
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
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-muted-foreground">
                  <Calculator className="w-4 h-4 mr-2 text-muted-foreground" />
                  Calculators
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 text-muted-foreground">
                    {calculators.map((calc) => (
                      <Link
                        key={calc.path}
                        to={calc.path}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors text-muted-foreground"
                      >
                        <div className="text-sm font-medium leading-none text-muted-foreground">
                          {calc.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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
