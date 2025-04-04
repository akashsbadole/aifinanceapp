import React from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import MainContent from "@/components/landing/MainContent";

const calculators = [
  { name: "EMI Calculator", path: "/calculators/emi" },
  { name: "SIP Calculator", path: "/calculators/sip" },
  { name: "FD Calculator", path: "/calculators/fd" },
  { name: "PPF Calculator", path: "/calculators/ppf" },
  { name: "RD Calculator", path: "/calculators/rd" },
  { name: "SSY Calculator", path: "/calculators/ssy" },
  { name: "SWP Calculator", path: "/calculators/swp" },
  { name: "Mutual Fund Calculator", path: "/calculators/mutual-fund" },
  { name: "Margin Calculator", path: "/calculators/margin" },
  { name: "Brokerage Calculator", path: "/calculators/brokerage" },
  { name: "Gratuity Calculator", path: "/calculators/gratuity" },
  { name: "NPS Calculator", path: "/calculators/nps" },
  { name: "EPF Calculator", path: "/calculators/epf" },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header calculators={calculators} />
      <main className="flex-grow pt-16">
        <MainContent />
      </main>
      <Footer calculators={calculators} />
    </div>
  );
};

export default Index;
