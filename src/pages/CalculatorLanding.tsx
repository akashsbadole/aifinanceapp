import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import {
  Calculator,
  PiggyBank,
  Building,
  TrendingUp,
  Receipt,
  Landmark,
} from "lucide-react";

interface CalculatorCardProps {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({
  title,
  description,
  path,
  icon,
}) => {
  return (
    <Link to={path}>
      <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Card>
    </Link>
  );
};

const CalculatorLanding = () => {
  const calculatorCategories = [
    {
      title: "Investment Calculators",
      icon: <PiggyBank size={24} />,
      calculators: [
        {
          title: "SIP Calculator",
          description: "Calculate returns on your systematic investment plans",
          path: "/calculators/sip",
          icon: <Calculator size={20} />,
        },
        {
          title: "Mutual Fund Calculator",
          description:
            "Estimate returns on lump sum or SIP mutual fund investments",
          path: "/calculators/mutual-fund",
          icon: <Calculator size={20} />,
        },
        {
          title: "SWP Calculator",
          description: "Plan your systematic withdrawal from investments",
          path: "/calculators/swp",
          icon: <Calculator size={20} />,
        },
      ],
    },
    {
      title: "Fixed Income & Savings",
      icon: <Building size={24} />,
      calculators: [
        {
          title: "FD Calculator",
          description: "Calculate fixed deposit returns with compound interest",
          path: "/calculators/fd",
          icon: <Calculator size={20} />,
        },
        {
          title: "RD Calculator",
          description: "Estimate returns on your recurring deposits",
          path: "/calculators/rd",
          icon: <Calculator size={20} />,
        },
        {
          title: "PPF Calculator",
          description: "Plan your Public Provident Fund investments",
          path: "/calculators/ppf",
          icon: <Calculator size={20} />,
        },
        {
          title: "SSY Calculator",
          description: "Calculate Sukanya Samriddhi Yojana returns",
          path: "/calculators/ssy",
          icon: <Calculator size={20} />,
        },
      ],
    },
    {
      title: "Trading Tools",
      icon: <TrendingUp size={24} />,
      calculators: [
        {
          title: "Brokerage Calculator",
          description: "Calculate trading charges, taxes, and net P&L",
          path: "/calculators/brokerage",
          icon: <Calculator size={20} />,
        },
        {
          title: "Margin Calculator",
          description: "Calculate margin requirements and leverage",
          path: "/calculators/margin",
          icon: <Calculator size={20} />,
        },
      ],
    },
    {
      title: "Loan & EMI",
      icon: <Landmark size={24} />,
      calculators: [
        {
          title: "EMI Calculator",
          description: "Calculate loan EMIs and total interest payments",
          path: "/calculators/emi",
          icon: <Calculator size={20} />,
        },
      ],
    },
    {
      title: "Tax & GST",
      icon: <Receipt size={24} />,
      calculators: [
        {
          title: "GST Calculator",
          description: "Calculate GST for different rates and scenarios",
          path: "/gst",
          icon: <Calculator size={20} />,
        },
      ],
    },
  ];

  const calculators = calculatorCategories.reduce((acc, category) => {
    return [
      ...acc,
      ...category.calculators.map((calc) => ({
        name: calc.title,
        path: calc.path,
      })),
    ];
  }, [] as Array<{ name: string; path: string }>);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header calculators={calculators} />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Financial Calculators</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive tools to help you make informed financial decisions
          </p>
        </div>

        <div className="space-y-12">
          {calculatorCategories.map((category, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 mb-6">
                {category.icon}
                <h2 className="text-2xl font-semibold">{category.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.calculators.map((calc, calcIndex) => (
                  <CalculatorCard
                    key={calcIndex}
                    title={calc.title}
                    description={calc.description}
                    path={calc.path}
                    icon={calc.icon}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer calculators={calculators} />
    </div>
  );
};

export default CalculatorLanding;
