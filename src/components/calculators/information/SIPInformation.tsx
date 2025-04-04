import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const SIPInformation = () => {
  const topAMCs = [
    { name: "SBI Mutual Fund", aum: "₹7.93 trillion" },
    { name: "ICICI Prudential Mutual Fund", aum: "₹6.21 trillion" },
    { name: "HDFC Mutual Fund", aum: "₹5.28 trillion" },
    { name: "Aditya Birla Sun Life Mutual Fund", aum: "₹3.24 trillion" },
    { name: "Nippon India Mutual Fund", aum: "₹3.21 trillion" },
  ];

  return (
    <Card className="p-6 mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-sip">
          <AccordionTrigger>What is SIP?</AccordionTrigger>
          <AccordionContent>
            <p>A Systematic Investment Plan (SIP) is an investment strategy where you invest a fixed amount in mutual funds at regular intervals (usually monthly) instead of making a lump-sum investment. This method follows the principle of rupee cost averaging and helps build a disciplined investment habit.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="benefits">
          <AccordionTrigger>Benefits of SIP</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Disciplined investing habit</li>
              <li>Rupee cost averaging - reduces impact of market volatility</li>
              <li>Power of compounding</li>
              <li>Start with small amounts (as low as ₹500)</li>
              <li>Flexibility to modify or stop investments</li>
              <li>No timing the market required</li>
              <li>Automatic investment process</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="risks">
          <AccordionTrigger>Risks and Disadvantages</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Market risk - Returns are not guaranteed</li>
              <li>May underperform in consistently rising markets compared to lump sum</li>
              <li>Requires long-term commitment for best results</li>
              <li>Impact of fees and expenses over time</li>
              <li>Exit load applicable on early withdrawals</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="top-companies">
          <AccordionTrigger>Top AMCs in India</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {topAMCs.map((amc, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{amc.name}</span>
                  <span className="text-muted-foreground">AUM: {amc.aum}</span>
                </div>
              ))}
              <p className="text-sm text-muted-foreground mt-4">
                *AUM (Assets Under Management) data as of 2025
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tips">
          <AccordionTrigger>Investment Tips</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Start early to benefit from compounding</li>
              <li>Choose funds based on your risk appetite and goals</li>
              <li>Diversify across different fund categories</li>
              <li>Review and rebalance your portfolio periodically</li>
              <li>Stay invested for the long term</li>
              <li>Consider increasing SIP amount annually</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tax-implications">
          <AccordionTrigger>Tax Implications</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p>For Equity Mutual Funds:</p>
              <ul className="list-disc pl-6">
                <li>STCG (held ≤ 1 year): 15% + applicable surcharge</li>
                <li>LTCG (held > 1 year): 10% on gains above ₹1 lakh per year</li>
              </ul>
              <p className="mt-2">For Debt Mutual Funds:</p>
              <ul className="list-disc pl-6">
                <li>STCG (held ≤ 3 years): Taxed at income tax slab rate</li>
                <li>LTCG (held > 3 years): 20% with indexation benefit</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default SIPInformation;