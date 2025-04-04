import React from "react";
import { Link } from "react-router-dom";

interface FooterProps {
  calculators: Array<{ name: string; path: string }>;
}

const Footer: React.FC<FooterProps> = ({ calculators }) => {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">BizNest</h3>
            <p className="text-sm text-muted-foreground">
              Simplified accounting for Indian small businesses.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#features"
                  className="text-sm text-muted-foreground hover:text-foreground premium-transition"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="#pricing"
                  className="text-sm text-muted-foreground hover:text-foreground premium-transition"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="#demo"
                  className="text-sm text-muted-foreground hover:text-foreground premium-transition"
                >
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="text-sm text-muted-foreground hover:text-foreground premium-transition"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/gst-guide"
                  className="text-sm text-muted-foreground hover:text-foreground premium-transition"
                >
                  GST Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground premium-transition"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground premium-transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground premium-transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground premium-transition"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Tools</h3>
            <ul className="space-y-2 max-h-[200px] overflow-y-auto">
              {calculators.map((calc) => (
                <li key={calc.path}>
                  <Link
                    to={calc.path}
                    className="text-sm text-muted-foreground hover:text-primary premium-transition"
                  >
                    {calc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} BizNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
