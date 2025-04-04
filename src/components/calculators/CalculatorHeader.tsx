import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, ChevronLeft } from "lucide-react";

interface CalculatorHeaderProps {
  title: string;
}

const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({ title }) => {
  return (
    <header className="border-b top-[200px] z-50 w-full glass-effect">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-medium">{title}</h1>
          </div>
        </div>
        <nav className="flex items-center space-x-4">
          <Link to="/calculators/emi" className="text-sm hover:text-primary">
            EMI
          </Link>
          <Link to="/calculators/sip" className="text-sm hover:text-primary">
            SIP
          </Link>
          <Link to="/calculators/fd" className="text-sm hover:text-primary">
            FD
          </Link>
          <Link to="/calculators/ppf" className="text-sm hover:text-primary">
            PPF
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default CalculatorHeader;
