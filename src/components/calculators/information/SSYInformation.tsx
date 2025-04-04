import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const SSYInformation = () => {
  const authorizedBanks = [
    {
      name: "State Bank of India",
      features: "Wide network, Online account opening",
    },
    {
      name: "Punjab National Bank",
      features: "Rural presence, Easy documentation",
    },
    { name: "Bank of Baroda", features: "Digital services, Quick processing" },
    {
      name: "Post Office",
      features: "Trusted institution, Widespread accessibility",
    },
    { name: "Canara Bank", features: "Dedicated staff, Simplified process" },
  ];

  return (
    <Card className="p-6 mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-ssy">
          <AccordionTrigger>What is Sukanya Samriddhi Yojana?</AccordionTrigger>
          <AccordionContent>
            <p>
              Sukanya Samriddhi Yojana (SSY) is a government-backed savings
              scheme for girl children in India. Launched as part of the 'Beti
              Bachao Beti Padhao' campaign, it offers one of the highest
              interest rates among government schemes and comes with tax
              benefits.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="benefits">
          <AccordionTrigger>Benefits of SSY</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>High interest rate (currently 8.0% p.a.)</li>
              <li>Tax benefits under Section 80C</li>
              <li>Interest earned and maturity amount are tax-free</li>
              <li>Government guaranteed returns</li>
              <li>Partial withdrawal allowed for education</li>
              <li>Account can be transferred anywhere in India</li>
              <li>Loan facility available against the account</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="eligibility">
          <AccordionTrigger>Eligibility & Requirements</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Only for girl child below 10 years of age</li>
              <li>Only one account per girl child (maximum two per family)</li>
              <li>Natural/legal guardian must be Indian resident</li>
              <li>Account operative till girl child turns 21</li>
              <li>
                Required Documents:
                <ul className="list-disc pl-6 mt-1">
                  <li>Birth certificate of girl child</li>
                  <li>Identity proof of guardian</li>
                  <li>Address proof</li>
                  <li>Photographs</li>
                </ul>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="service-providers">
          <AccordionTrigger>Where to Open SSY Account</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {authorizedBanks.map((bank, index) => (
                <div key={index} className="space-y-1">
                  <span className="font-medium">{bank.name}</span>
                  <p className="text-sm text-muted-foreground">
                    {bank.features}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="key-features">
          <AccordionTrigger>Key Features</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Investment Amount:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Minimum: ₹250 per year</li>
                  <li>Maximum: ₹1.5 lakh per year</li>
                  <li>Deposits in multiples of ₹100</li>
                </ul>
              </li>
              <li>
                <strong>Account Duration:</strong> Till girl child turns 21
              </li>
              <li>
                <strong>Interest Calculation:</strong> Annually, compounded
                yearly
              </li>
              <li>
                <strong>Deposit Flexibility:</strong> Monthly/Quarterly/Yearly
              </li>
              <li>
                <strong>Premature Closure:</strong> Allowed in case of marriage
                after 18
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tax-benefits">
          <AccordionTrigger>Tax Benefits</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Investment qualifies for Section 80C deduction</li>
              <li>Maximum deduction limit: ₹1.5 lakh per year</li>
              <li>Interest earned is completely tax-free</li>
              <li>Maturity amount is exempt from tax</li>
              <li>EEE (Exempt-Exempt-Exempt) status</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="withdrawal-rules">
          <AccordionTrigger>Withdrawal Rules</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Partial Withdrawal:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Up to 50% for education after age 18</li>
                  <li>Proof of admission required</li>
                </ul>
              </li>
              <li>
                <strong>Premature Closure:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Allowed for marriage after 18</li>
                  <li>Death of account holder</li>
                  <li>Change in residency status</li>
                </ul>
              </li>
              <li>
                <strong>Regular Maturity:</strong> At age 21
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="investment-tips">
          <AccordionTrigger>Investment Tips</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Open account as early as possible (before age 10)</li>
              <li>Maximize annual contribution for better returns</li>
              <li>Maintain regular deposits to avoid account deactivation</li>
              <li>Keep account documents safe and updated</li>
              <li>Plan deposits according to financial goals</li>
              <li>Consider inflation when planning for education</li>
              <li>Keep track of interest rate changes</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default SSYInformation;
