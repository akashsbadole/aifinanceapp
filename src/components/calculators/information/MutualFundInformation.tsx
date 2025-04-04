import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const MutualFundInformation = () => {
  const topFunds = [
    { name: "SBI Bluechip Fund", category: "Large Cap", returns: "12-15%" },
    { name: "Axis Midcap Fund", category: "Mid Cap", returns: "15-18%" },
    { name: "HDFC Balanced Advantage", category: "Hybrid", returns: "10-12%" },
    { name: "Mirae Asset Emerging Bluechip", category: "Large & Mid Cap", returns: "14-16%" },
    { name: "Parag Parikh Flexi Cap", category: "Flexi Cap", returns: "13-15%" },
  ];

  return (
    <Card className="p-6 mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-are-mfs">
          <AccordionTrigger>What are Mutual Funds?</AccordionTrigger>
          <AccordionContent>
            <p>Mutual Funds are investment vehicles that pool money from multiple investors to invest in stocks, bonds, and other securities. They are professionally managed and offer diversification benefits. Different types of funds cater to various investment objectives and risk appetites.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types">
          <AccordionTrigger>Types of Mutual Funds</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Equity Funds:</strong> Invest primarily in stocks
                <ul className="list-disc pl-6 mt-1">
                  <li>Large Cap: Lower risk, stable returns</li>
                  <li>Mid Cap: Moderate risk, higher growth potential</li>
                  <li>Small Cap: High risk, highest growth potential</li>
                </ul>
              </li>
              <li><strong>Debt Funds:</strong> Invest in bonds and fixed-income securities</li>
              <li><strong>Hybrid Funds:</strong> Mix of equity and debt</li>
              <li><strong>Index Funds:</strong> Track market indices</li>
              <li><strong>Sector Funds:</strong> Focus on specific industries</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="benefits">
          <AccordionTrigger>Benefits of Mutual Funds</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Professional management</li>
              <li>Diversification across securities</li>
              <li>Lower investment threshold</li>
              <li>High liquidity (except ELSS)</li>
              <li>Regulated by SEBI</li>
              <li>Transparency in operations</li>
              <li>Various investment options (SIP/lumpsum)</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="risks">
          <AccordionTrigger>Risks and Considerations</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Market risk - No guaranteed returns</li>
              <li>Interest rate risk (for debt funds)</li>
              <li>Credit risk in debt funds</li>
              <li>Expense ratio impact on returns</li>
              <li>Exit load during early redemption</li>
              <li>Fund manager risk</li>
              <li>Tax implications on gains</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="top-funds">
          <AccordionTrigger>Top Performing Funds</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {topFunds.map((fund, index) => (
                <div key={index} className="flex flex-col space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{fund.name}</span>
                    <span className="text-muted-foreground">Returns: {fund.returns}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Category: {fund.category}</span>
                </div>
              ))}
              <p className="text-sm text-muted-foreground mt-4">
                *Historical returns (3-5 years) as of 2025. Past performance doesn't guarantee future returns.
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
              <p className="mt-2">ELSS Funds:</p>
              <ul className="list-disc pl-6">
                <li>Tax deduction under Section 80C up to ₹1.5 lakh</li>
                <li>3-year lock-in period</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="investment-tips">
          <AccordionTrigger>Investment Strategy Tips</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Start early to benefit from compounding</li>
              <li>Diversify across fund categories</li>
              <li>Choose funds based on:
                <ul className="list-disc pl-6 mt-1">
                  <li>Investment horizon</li>
                  <li>Risk tolerance</li>
                  <li>Financial goals</li>
                </ul>
              </li>
              <li>Monitor and rebalance portfolio periodically</li>
              <li>Consider SIP for disciplined investing</li>
              <li>Check expense ratio and fund size</li>
              <li>Research fund manager's track record</li>
              <li>Read scheme documents carefully</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default MutualFundInformation;