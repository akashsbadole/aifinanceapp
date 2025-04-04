import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalculatorHeader from "./CalculatorHeader";
import CalculatorFooter from "./CalculatorFooter";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface BaseCalculatorProps {
  title: string;
  children: React.ReactNode;
}

const BaseCalculator: React.FC<BaseCalculatorProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <CalculatorHeader title={title} />
      <main className="flex-grow container mx-auto p-6">
        <header className="fixed top-0 z-50 w-full glass-effect border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-primary">
                <a href="/">BizNest</a>
              </h1>
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
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">{children}</div>
          </CardContent>
        </Card>
      </main>
      <CalculatorFooter />
    </div>
  );
};

export default BaseCalculator;
