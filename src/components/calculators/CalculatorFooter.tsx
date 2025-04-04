import React from "react";
import { Link } from "react-router-dom";

const CalculatorFooter: React.FC = () => {
  return (
    <footer className="mt-8 border-t py-6 text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div>
            <nav className="flex flex-wrap gap-4">
              <Link to="/help" className="hover:text-primary">
                Help & Documentation
              </Link>
              <Link to="/terms" className="hover:text-primary">
                Terms of Use
              </Link>
              <Link to="/privacy" className="hover:text-primary">
                Privacy Policy
              </Link>
            </nav>
            <p className="mt-10 text-xs text-muted-foreground">
              BizNest Financial Tools is a product of BizNest Technologies ©{" "}
              {new Date().getFullYear()} BizNest Financial Tools. All rights
              reserved.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Investment Tools</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/calculators/sip" className="hover:text-primary">
                  SIP Calculator
                </Link>
                <Link
                  to="/calculators/mutual-fund"
                  className="hover:text-primary"
                >
                  Mutual Fund Calculator
                </Link>
                <Link to="/calculators/ppf" className="hover:text-primary">
                  PPF Calculator
                </Link>
                <Link to="/calculators/ssy" className="hover:text-primary">
                  SSY Calculator
                </Link>
                <Link to="/calculators/swp" className="hover:text-primary">
                  SWP Calculator
                </Link>
              </nav>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Fixed Income</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/calculators/fd" className="hover:text-primary">
                  FD Calculator
                </Link>
                <Link to="/calculators/rd" className="hover:text-primary">
                  RD Calculator
                </Link>
                <Link to="/calculators/emi" className="hover:text-primary">
                  EMI Calculator
                </Link>
              </nav>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Trading Tools</h4>
              <nav className="flex flex-col gap-2">
                <Link
                  to="/calculators/brokerage"
                  className="hover:text-primary"
                >
                  Brokerage Calculator
                </Link>
                <Link to="/calculators/margin" className="hover:text-primary">
                  Margin Calculator
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CalculatorFooter;
