import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const EMIInformation = () => {
  const topLenders = [
    {
      name: "State Bank of India",
      rate: "8.40% - 10.50%",
      features: "No prepayment charges, Quick approvals",
    },
    {
      name: "HDFC Bank",
      rate: "8.35% - 11.25%",
      features: "Digital process, Flexible tenure",
    },
    {
      name: "ICICI Bank",
      rate: "8.60% - 11.00%",
      features: "Online EMI calculator, Easy balance transfer",
    },
    {
      name: "Axis Bank",
      rate: "8.65% - 11.50%",
      features: "Part payment facility, Minimal documentation",
    },
    {
      name: "Kotak Mahindra Bank",
      rate: "8.70% - 11.75%",
      features: "Quick disbursement, Competitive rates",
    },
  ];

  return (
    <Card className="p-6 mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-emi">
          <AccordionTrigger>What is EMI?</AccordionTrigger>
          <AccordionContent>
            <p>
              Equated Monthly Installment (EMI) is a fixed payment amount made
              by a borrower to a lender at a specified date each month. EMIs are
              used to pay off both the principal and interest on a loan,
              allowing you to repay the loan in manageable monthly payments
              rather than a lump sum.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="loan-types">
          <AccordionTrigger>Types of Loans</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Home Loan:</strong> Long-term financing for property
                purchase
              </li>
              <li>
                <strong>Personal Loan:</strong> Unsecured loan for personal
                needs
              </li>
              <li>
                <strong>Car Loan:</strong> Vehicle financing with the car as
                collateral
              </li>
              <li>
                <strong>Education Loan:</strong> Financing for higher education
              </li>
              <li>
                <strong>Business Loan:</strong> Funding for business
                requirements
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="factors">
          <AccordionTrigger>Factors Affecting EMI</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Principal loan amount</li>
              <li>Interest rate</li>
              <li>Loan tenure</li>
              <li>Type of interest (Fixed/Floating)</li>
              <li>Credit score</li>
              <li>Income and repayment capacity</li>
              <li>Processing fees and charges</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="top-lenders">
          <AccordionTrigger>Top Lenders and Interest Rates</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {topLenders.map((lender, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{lender.name}</span>
                    <span className="text-muted-foreground">
                      Rate: {lender.rate}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {lender.features}
                  </p>
                </div>
              ))}
              <p className="text-sm text-muted-foreground mt-4">
                *Rates shown are for home loans as of 2025. Actual rates may
                vary based on credit score and loan amount.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="documentation">
          <AccordionTrigger>Required Documentation</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identity proof (Aadhaar, PAN, etc.)</li>
              <li>Address proof</li>
              <li>
                Income proof:
                <ul className="list-disc pl-6 mt-1">
                  <li>Salary slips (3-6 months)</li>
                  <li>Form 16</li>
                  <li>Bank statements</li>
                  <li>ITR for self-employed</li>
                </ul>
              </li>
              <li>Property documents (for secured loans)</li>
              <li>Photographs</li>
              <li>Employment details</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tips">
          <AccordionTrigger>EMI Management Tips</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Compare interest rates across lenders</li>
              <li>Check your credit score before applying</li>
              <li>Consider prepayment options</li>
              <li>Maintain emergency fund for EMIs</li>
              <li>Opt for shorter tenure if affordable</li>
              <li>Read loan agreement carefully</li>
              <li>Consider loan insurance</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tax-benefits">
          <AccordionTrigger>Tax Benefits</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p>Home Loan:</p>
              <ul className="list-disc pl-6">
                <li>Principal repayment: Section 80C (up to ₹1.5 lakh)</li>
                <li>Interest payment: Section 24(b) (up to ₹2 lakh)</li>
                <li>Additional deduction under Section 80EEA</li>
              </ul>
              <p className="mt-2">Education Loan:</p>
              <ul className="list-disc pl-6">
                <li>Interest deduction under Section 80E</li>
                <li>No maximum limit</li>
                <li>Available for 8 years from repayment start</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default EMIInformation;
