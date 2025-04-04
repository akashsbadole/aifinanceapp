import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const PPFInformation = () => {
  const topProviders = [
    {
      name: "State Bank of India",
      features: "Net banking, Mobile app, Extensive branch network",
    },
    {
      name: "HDFC Bank",
      features: "Digital account opening, Auto-debit facility",
    },
    { name: "ICICI Bank", features: "Integrated with other banking services" },
    { name: "Punjab National Bank", features: "Wide rural presence" },
    {
      name: "Post Office",
      features: "Traditional reliable option, Widespread network",
    },
  ];

  return (
    <Card className="p-6 mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-ppf">
          <AccordionTrigger>What is PPF?</AccordionTrigger>
          <AccordionContent>
            <p>
              Public Provident Fund (PPF) is a long-term savings scheme backed
              by the Government of India. It offers a secure investment option
              with tax benefits and guaranteed returns. The current interest
              rate is set quarterly by the government and compounds annually.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="benefits">
          <AccordionTrigger>Benefits of PPF</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Government-backed scheme with guaranteed returns</li>
              <li>Tax benefits under Section 80C (up to ₹1.5 lakh)</li>
              <li>Interest earned and maturity amount are tax-free</li>
              <li>Compound interest benefit</li>
              <li>Cannot be attached for debt recovery</li>
              <li>Loan facility available from 3rd year</li>
              <li>Partial withdrawal allowed after 7th year</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="restrictions">
          <AccordionTrigger>Limitations and Restrictions</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Long lock-in period of 15 years</li>
              <li>Maximum investment limit of ₹1.5 lakh per year</li>
              <li>Minimum deposit of ₹500 per year required</li>
              <li>Only one account per person (except for minor child)</li>
              <li>Limited withdrawal options before maturity</li>
              <li>Interest rates subject to quarterly revision</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="top-providers">
          <AccordionTrigger>Where to Open PPF Account</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {topProviders.map((provider, index) => (
                <div key={index} className="space-y-1">
                  <span className="font-medium">{provider.name}</span>
                  <p className="text-sm text-muted-foreground">
                    {provider.features}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tax-benefits">
          <AccordionTrigger>Tax Benefits</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p>Triple Tax Benefit (EEE):</p>
              <ul className="list-disc pl-6">
                <li>
                  <strong>E</strong> - Investment deductible under Section 80C
                </li>
                <li>
                  <strong>E</strong> - Interest earned is tax-free
                </li>
                <li>
                  <strong>E</strong> - Maturity amount is tax-free
                </li>
                <li>Deduction limit: Up to ₹1.5 lakh per financial year</li>
                <li>No TDS applicable on interest</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger>Key Features</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Interest Calculation:</strong> Compounded annually
              </li>
              <li>
                <strong>Minimum Investment:</strong> ₹500 per year
              </li>
              <li>
                <strong>Maximum Investment:</strong> ₹1.5 lakh per year
              </li>
              <li>
                <strong>Investment Frequency:</strong> Monthly or lump sum
              </li>
              <li>
                <strong>Account Term:</strong> 15 years (extendable in blocks of
                5 years)
              </li>
              <li>
                <strong>Loan Facility:</strong> Available from 3rd to 6th year
              </li>
              <li>
                <strong>Partial Withdrawal:</strong> Allowed from 7th year
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="investment-tips">
          <AccordionTrigger>Investment Tips</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Invest before 5th of each month for maximum interest benefit
              </li>
              <li>Maintain consistent yearly investments</li>
              <li>Consider maximizing contribution to get full tax benefit</li>
              <li>
                Plan for long-term as premature withdrawal has restrictions
              </li>
              <li>Keep track of interest rate changes</li>
              <li>Consider extending account after maturity if beneficial</li>
              <li>Use auto-debit facility for regular investments</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default PPFInformation;
