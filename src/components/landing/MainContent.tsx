import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  LayoutDashboard,
  FileText,
  BarChart4,
  Receipt,
  CheckCircle,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="glass-card p-6 hover-float premium-transition">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const MainContent: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-32 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8 animate-fade-up">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                Simplified Accounting for Indian Small Businesses
              </h1>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                Manage your finances, GST compliance, and invoicing in one
                beautifully designed platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="rounded-full gap-2 px-8">
                  Try Dashboard
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-accent/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              All-in-One Business Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-[800px]">
              Everything you need to manage your Indian small business finances
              in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<LayoutDashboard size={24} />}
              title="Financial Dashboard"
              description="Get a complete overview of your business finances with our intuitive dashboard."
            />
            <FeatureCard
              icon={<FileText size={24} />}
              title="GST-Ready Invoicing"
              description="Create professional invoices with automatic GST calculations and compliance."
            />
            <FeatureCard
              icon={<BarChart4 size={24} />}
              title="Expense Tracking"
              description="Easily record, categorize and manage all your business expenses."
            />
            <FeatureCard
              icon={<Receipt size={24} />}
              title="GST Compliance"
              description="Simplify your GST filings with automated calculations and reports."
            />
            <FeatureCard
              icon={<BarChart4 size={24} />}
              title="Financial Reports"
              description="Generate comprehensive financial reports to make informed business decisions."
            />
            <FeatureCard
              icon={<CheckCircle size={24} />}
              title="Business Insights"
              description="Gain valuable insights into your business performance and growth opportunities."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="glass-card p-8 md:p-12 flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to transform your business finances?
            </h2>
            <p className="text-lg text-muted-foreground max-w-[800px]">
              Join thousands of Indian small businesses who've simplified their
              accounting with BizNest.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="rounded-full gap-2 px-8">
                Get Started Now
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default MainContent;
