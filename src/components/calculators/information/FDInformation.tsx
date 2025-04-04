import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const FDInformation = () => {
  const topBanks = [
    {
      name: "State Bank of India",
      rate: "6.50% - 7.10%",
      features: "Special rates for senior citizens, Online FD",
    },
    {
      name: "HDFC Bank",
      rate: "6.75% - 7.25%",
      features: "Auto-renewal facility, Loan against FD",
    },
    {
      name: "ICICI Bank",
      rate: "6.70% - 7.20%",
      features: "iMobile banking, FD with insurance",
    },
    {
      name: "Axis Bank",
      rate: "6.75% - 7.15%",
      features: "Digital FD opening, Multi-deposit facility",
    },
    {
      name: "Small Finance Banks",
      rate: "7.50% - 8.25%",
      features: "Higher interest rates, Monthly payout option",
    },
  ];

  return (
    <Card className="p-6 mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-fd">
          <AccordionTrigger>What is Fixed Deposit?</AccordionTrigger>
          <AccordionContent>
            <p>
              A Fixed Deposit (FD) is a secure investment option where you
              deposit a lump sum for a fixed period at a predetermined interest
              rate. The interest rate remains constant throughout the term,
              providing guaranteed returns. FDs are offered by banks, post
              offices, and some NBFCs.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types">
          <AccordionTrigger>Types of Fixed Deposits</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Standard FD:</strong> Regular fixed deposit with fixed
                tenure
              </li>
              <li>
                <strong>Tax Saver FD:</strong> 5-year lock-in with tax benefits
              </li>
              <li>
                <strong>Senior Citizen FD:</strong> Higher interest rates for
                elderly
              </li>
              <li>
                <strong>Cumulative FD:</strong> Interest reinvested with
                principal
              </li>
              <li>
                <strong>Non-Cumulative FD:</strong> Regular interest payouts
              </li>
              <li>
                <strong>Corporate FD:</strong> Higher rates with company
                deposits
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="benefits">
          <AccordionTrigger>Benefits of Fixed Deposits</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Guaranteed returns</li>
              <li>Fixed interest rates</li>
              <li>Flexible tenure options</li>
              <li>Bank deposit insurance up to ₹5 lakhs</li>
              <li>Loan facility against FD</li>
              <li>Easy premature withdrawal</li>
              <li>Auto-renewal facility</li>
              <li>Special senior citizen rates</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="top-rates">
          <AccordionTrigger>Top FD Rates</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {topBanks.map((bank, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{bank.name}</span>
                    <span className="text-muted-foreground">
                      Rate: {bank.rate}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {bank.features}
                  </p>
                </div>
              ))}
              <p className="text-sm text-muted-foreground mt-4">
                *Rates shown are for 1-5 year deposits as of 2025. Senior
                citizens usually get 0.5% additional interest.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tax-implications">
          <AccordionTrigger>Tax Implications</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <ul className="list-disc pl-6">
                <li>
                  <strong>TDS Rules:</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>
                      TDS applicable if interest exceeds ₹40,000 per year
                      (₹50,000 for senior citizens)
                    </li>
                    <li>TDS rate: 10% for residents</li>
                    <li>Form 15G/15H can be submitted to avoid TDS</li>
                  </ul>
                </li>
                <li>
                  <strong>Tax Benefits:</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>
                      5-year Tax Saver FD eligible for Section 80C deduction
                    </li>
                    <li>Maximum deduction of ₹1.5 lakh per year</li>
                    <li>Interest income taxable as per slab rate</li>
                  </ul>
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="key-features">
          <AccordionTrigger>Key Features</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Tenure Options:</strong> 7 days to 10 years
              </li>
              <li>
                <strong>Minimum Investment:</strong> Usually ₹1,000
              </li>
              <li>
                <strong>Interest Payout Options:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Monthly</li>
                  <li>Quarterly</li>
                  <li>Half-yearly</li>
                  <li>Annually</li>
                  <li>At maturity</li>
                </ul>
              </li>
              <li>
                <strong>Premature Withdrawal:</strong> Usually allowed with
                penalty
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="investment-tips">
          <AccordionTrigger>Investment Tips</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Compare rates across banks</li>
              <li>Consider laddering FDs for better liquidity</li>
              <li>Check for special rates during festivals</li>
              <li>Evaluate premature withdrawal penalties</li>
              <li>Plan for interest reinvestment</li>
              <li>Consider inflation impact</li>
              <li>Split large deposits across banks</li>
              <li>Use Form 15G/15H to avoid TDS if eligible</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="documentation">
          <AccordionTrigger>Required Documents</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identity proof (Aadhaar, PAN, etc.)</li>
              <li>Address proof</li>
              <li>Recent photograph</li>
              <li>PAN card (mandatory for deposits over ₹50,000)</li>
              <li>Form 15G/15H (if applicable)</li>
              <li>Age proof (for senior citizen FD)</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default FDInformation;
