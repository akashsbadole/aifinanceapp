import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const RDInformation = () => {
  const topBanks = [
    { name: "State Bank of India", rate: "6.25% - 7.00%" },
    { name: "HDFC Bank", rate: "6.50% - 7.25%" },
    { name: "ICICI Bank", rate: "6.40% - 7.10%" },
    { name: "Axis Bank", rate: "6.35% - 7.15%" },
    { name: "Kotak Mahindra Bank", rate: "6.45% - 7.20%" },
  ];

  return (
    <Card className="p-6 mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-rd">
          <AccordionTrigger>What is Recurring Deposit?</AccordionTrigger>
          <AccordionContent>
            <p>
              A Recurring Deposit (RD) is a type of term deposit where you
              deposit a fixed amount every month. It helps in building a
              sizeable corpus through disciplined monthly savings. The interest
              is compounded quarterly in most banks, and you get guaranteed
              returns at maturity.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="benefits">
          <AccordionTrigger>Benefits of RD</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Helps develop regular saving habits</li>
              <li>Guaranteed returns with fixed interest rates</li>
              <li>Flexible tenure options (6 months to 10 years)</li>
              <li>Can start with small monthly deposits</li>
              <li>Loan facility available against RD</li>
              <li>Auto-debit facility for hassle-free deposits</li>
              <li>Higher interest rates than savings accounts</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="limitations">
          <AccordionTrigger>Limitations</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Penalty for missed monthly installments</li>
              <li>
                Lower interest rates compared to market-linked investments
              </li>
              <li>TDS applicable on interest earned</li>
              <li>Premature withdrawal penalties</li>
              <li>Fixed monthly commitment required</li>
              <li>No tax benefits under Section 80C</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="top-banks">
          <AccordionTrigger>Top Banks and Current Rates</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {topBanks.map((bank, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{bank.name}</span>
                  <span className="text-muted-foreground">
                    Rate: {bank.rate}
                  </span>
                </div>
              ))}
              <p className="text-sm text-muted-foreground mt-4">
                *Rates shown are for various tenures as of 2025
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tax-implications">
          <AccordionTrigger>Tax Implications</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Interest earned is taxable as per your income tax slab</li>
              <li>
                TDS applicable if interest exceeds ₹40,000 per year (₹50,000 for
                senior citizens)
              </li>
              <li>Form 15G/15H can be submitted to avoid TDS if eligible</li>
              <li>
                Interest is taxable on accrual basis, even if not received
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger>Key Features</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Minimum Investment:</strong> Usually ₹100-500 per month
              </li>
              <li>
                <strong>Tenure Options:</strong> 6 months to 10 years
              </li>
              <li>
                <strong>Interest Calculation:</strong> Quarterly compounding
              </li>
              <li>
                <strong>Payment Flexibility:</strong> Multiple advance
                installments allowed
              </li>
              <li>
                <strong>Senior Citizen Benefits:</strong> Additional interest
                rate (usually 0.5%)
              </li>
              <li>
                <strong>Nomination Facility:</strong> Available
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="investment-tips">
          <AccordionTrigger>Smart Investment Tips</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Choose auto-debit facility to avoid missing installments</li>
              <li>Align deposit date with salary credit date</li>
              <li>Compare rates across banks before investing</li>
              <li>Consider starting multiple RDs for different goals</li>
              <li>Keep buffer money for monthly installments</li>
              <li>Understand penalties before premature withdrawal</li>
              <li>Check for special rates during festive seasons</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default RDInformation;
