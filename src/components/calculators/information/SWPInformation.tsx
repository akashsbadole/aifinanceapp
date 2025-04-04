import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const SWPInformation = () => {
  const popularFunds = [
    { name: "HDFC Balanced Advantage Fund", type: "Hybrid", features: "Dynamic asset allocation, Lower volatility" },
    { name: "ICICI Prudential Equity & Debt Fund", type: "Hybrid", features: "Regular income, Capital appreciation" },
    { name: "Aditya Birla Sun Life Regular Savings Fund", type: "Debt", features: "Stable returns, Monthly income option" },
    { name: "SBI Conservative Hybrid Fund", type: "Hybrid", features: "Conservative approach, Regular dividends" },
    { name: "Nippon India Income Fund", type: "Debt", features: "Focus on high-quality debt, Regular payouts" },
  ];

  return (
    <Card className="p-6 mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-swp">
          <AccordionTrigger>What is Systematic Withdrawal Plan (SWP)?</AccordionTrigger>
          <AccordionContent>
            <p>A Systematic Withdrawal Plan (SWP) is a facility that allows investors to withdraw a fixed amount from their mutual fund investments at regular intervals. It's particularly useful for retirees or those seeking regular income from their investments while keeping the remaining corpus invested in the market.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="benefits">
          <AccordionTrigger>Benefits of SWP</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Regular income stream</li>
              <li>Better tax efficiency compared to dividend option</li>
              <li>Flexibility in withdrawal amount and frequency</li>
              <li>Remaining investment continues to grow</li>
              <li>Better liquidity management</li>
              <li>No TDS on withdrawals</li>
              <li>Capital appreciation potential</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="considerations">
          <AccordionTrigger>Important Considerations</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Market risk impact on corpus</li>
              <li>Withdrawal sustainability</li>
              <li>Exit load implications</li>
              <li>Tax implications on gains</li>
              <li>Impact of inflation</li>
              <li>Required corpus calculation</li>
              <li>Fund selection criteria</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="suitable-funds">
          <AccordionTrigger>Popular Funds for SWP</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {popularFunds.map((fund, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{fund.name}</span>
                    <span className="text-muted-foreground">Type: {fund.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{fund.features}</p>
                </div>
              ))}
              <p className="text-sm text-muted-foreground mt-4">
                *Fund selection should be based on individual risk profile and investment horizon
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tax-implications">
          <AccordionTrigger>Tax Implications</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p>Equity Funds:</p>
              <ul className="list-disc pl-6">
                <li>STCG (held ≤ 1 year): 15% + surcharge</li>
                <li>LTCG (held > 1 year): 10% above ₹1 lakh per year</li>
              </ul>
              <p className="mt-2">Debt Funds:</p>
              <ul className="list-disc pl-6">
                <li>STCG (held ≤ 3 years): As per income tax slab</li>
                <li>LTCG (held > 3 years): 20% with indexation</li>
              </ul>
              <p className="mt-2">Key Points:</p>
              <ul className="list-disc pl-6">
                <li>Each withdrawal is considered a redemption</li>
                <li>FIFO basis for calculating holding period</li>
                <li>No TDS on withdrawals</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="withdrawal-strategies">
          <AccordionTrigger>Withdrawal Strategies</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Fixed Amount:</strong> Constant monthly withdrawal</li>
              <li><strong>Appreciation Withdrawal:</strong> Only profits withdrawn</li>
              <li><strong>Variable Amount:</strong> Based on market conditions</li>
              <li><strong>Hybrid Approach:</strong> Combination of fixed and variable</li>
              <li>Considerations for each strategy:
                <ul className="list-disc pl-6 mt-1">
                  <li>Market conditions</li>
                  <li>Income requirements</li>
                  <li>Risk tolerance</li>
                  <li>Investment horizon</li>
                </ul>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="best-practices">
          <AccordionTrigger>Best Practices</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Start with adequate corpus</li>
              <li>Consider withdrawal rate sustainability</li>
              <li>Maintain emergency buffer</li>
              <li>Review and rebalance portfolio regularly</li>
              <li>Plan for inflation impact</li>
              <li>Diversify across fund categories</li>
              <li>Monitor fund performance</li>
              <li>Understand exit load implications</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default SWPInformation;