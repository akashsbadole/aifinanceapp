import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const BrokerageInformation = () => {
  const brokerageStructures = [
    {
      name: "Zerodha",
      plan: "Flat Fee",
      charges: "₹20 or 0.03% per order",
      features: "Zero brokerage for delivery",
    },
    {
      name: "Angel One",
      plan: "Basic",
      charges: "₹20 per order",
      features: "Flat fee structure",
    },
    {
      name: "Upstox",
      plan: "Pro",
      charges: "₹20 or 0.05% per order",
      features: "Free delivery trades",
    },
    {
      name: "5paisa",
      plan: "Digital",
      charges: "₹20 or 0.05% per order",
      features: "Zero maintenance charges",
    },
    {
      name: "ICICI Direct",
      plan: "Prime",
      charges: "0.25% to 0.50%",
      features: "3-in-1 Account benefits",
    },
  ];

  return (
    <Card className="p-6 mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="about-brokerage">
          <AccordionTrigger>What is Brokerage?</AccordionTrigger>
          <AccordionContent>
            <p>
              Brokerage is the fee charged by stockbrokers for executing trades
              on behalf of clients. It can be structured as a flat fee per trade
              or as a percentage of the transaction value. Understanding
              brokerage charges is crucial for calculating the break-even point
              and net profit/loss from trades.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="charge-types">
          <AccordionTrigger>Types of Trading Charges</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Brokerage:</strong> Main trading commission
              </li>
              <li>
                <strong>STT (Securities Transaction Tax):</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Equity Delivery: 0.1% on buy and sell</li>
                  <li>Equity Intraday: 0.025% on sell side</li>
                  <li>F&O: 0.0125% on sell side</li>
                </ul>
              </li>
              <li>
                <strong>Exchange Transaction Charges:</strong> NSE/BSE fees
              </li>
              <li>
                <strong>GST:</strong> 18% on brokerage and transaction charges
              </li>
              <li>
                <strong>SEBI Charges:</strong> ₹10 per crore
              </li>
              <li>
                <strong>Stamp Duty:</strong> State-wise charges on buy side
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brokerage-plans">
          <AccordionTrigger>Popular Brokerage Plans</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {brokerageStructures.map((broker, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{broker.name}</span>
                    <span className="text-muted-foreground">{broker.plan}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{broker.charges}</span>
                    <span className="text-muted-foreground">
                      {broker.features}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="segment-charges">
          <AccordionTrigger>Segment-wise Charges</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Equity Delivery:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Higher STT (0.1%)</li>
                  <li>Often zero or low brokerage</li>
                  <li>Stamp duty applicable</li>
                </ul>
              </li>
              <li>
                <strong>Equity Intraday:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Lower STT (0.025%)</li>
                  <li>Higher brokerage</li>
                  <li>Leverage available</li>
                </ul>
              </li>
              <li>
                <strong>F&O Trading:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>STT on premium/settlement</li>
                  <li>Higher exposure</li>
                  <li>Flat brokerage common</li>
                </ul>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="breakeven">
          <AccordionTrigger>Understanding Break-even</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Break-even Point:</strong> Price movement needed to
                cover all charges
              </li>
              <li>
                <strong>Factors Affecting Break-even:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Trading segment (Delivery/Intraday/F&O)</li>
                  <li>Brokerage structure</li>
                  <li>Position size</li>
                  <li>Holding period</li>
                </ul>
              </li>
              <li>
                <strong>Impact on Strategy:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Higher for frequent trades</li>
                  <li>Lower for delivery trades</li>
                  <li>Varies with leverage used</li>
                </ul>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tax-aspects">
          <AccordionTrigger>Tax Implications</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Short-term Capital Gains:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Equity: 15% for holding period &lt; 1 year</li>
                  <li>Intraday: Taxed as business income</li>
                </ul>
              </li>
              <li>
                <strong>Long-term Capital Gains:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>10% above ₹1 lakh per year</li>
                  <li>Applicable on holding &gt; 1 year</li>
                </ul>
              </li>
              <li>
                <strong>F&O Trading:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Considered as non-speculative business income</li>
                  <li>Subject to normal tax rates</li>
                </ul>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cost-reduction">
          <AccordionTrigger>Cost Reduction Strategies</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Choose appropriate brokerage plan</li>
              <li>Optimize trade frequency</li>
              <li>Consider delivery over intraday for long-term</li>
              <li>Use limit orders to control costs</li>
              <li>Compare total charges across brokers</li>
              <li>Look for package deals and offers</li>
              <li>Maintain adequate trading volume</li>
              <li>Use technology for efficient execution</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="platform-features">
          <AccordionTrigger>Trading Platform Features</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <strong>Essential Features:</strong>
              <ul className="list-disc pl-6 mt-1">
                <li>Real-time brokerage calculator</li>
                <li>Charge breakup display</li>
                <li>P&L calculator</li>
                <li>Margin calculator</li>
              </ul>
              <strong>Advanced Features:</strong>
              <ul className="list-disc pl-6 mt-1">
                <li>Bracket/Cover order support</li>
                <li>Position sizing tools</li>
                <li>Tax P&L reports</li>
                <li>Portfolio analytics</li>
              </ul>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default BrokerageInformation;
