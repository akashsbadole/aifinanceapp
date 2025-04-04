import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const MarginInformation = () => {
  const topBrokers = [
    {
      name: "Zerodha",
      margin: "Up to 5x",
      features: "Low brokerage, Modern platform",
    },
    {
      name: "ICICI Direct",
      margin: "Up to 4x",
      features: "3-in-1 Account, Research support",
    },
    {
      name: "Angel One",
      margin: "Up to 4x",
      features: "AI-powered insights, Smart API",
    },
    { name: "Upstox", margin: "Up to 4x", features: "Low cost, Easy to use" },
    {
      name: "Groww",
      margin: "Up to 3x",
      features: "Commission-free, User friendly",
    },
  ];

  return (
    <Card className="p-6 mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-margin">
          <AccordionTrigger>What is Margin Trading?</AccordionTrigger>
          <AccordionContent>
            <p>
              Margin trading allows investors to buy securities by paying only a
              percentage of the total value, with the remaining amount borrowed
              from the broker. This leverage can amplify both gains and losses.
              The margin requirement varies based on the type of security and
              market conditions.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types">
          <AccordionTrigger>Types of Margin</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Initial Margin:</strong> Minimum amount required to open
                a position
              </li>
              <li>
                <strong>Maintenance Margin:</strong> Minimum balance to keep
                position open
              </li>
              <li>
                <strong>Intraday Margin:</strong> Higher leverage for same-day
                trades
              </li>
              <li>
                <strong>Delivery Margin:</strong> For holding positions
                overnight
              </li>
              <li>
                <strong>Options/Futures Margin:</strong> For derivatives trading
              </li>
              <li>
                <strong>Exposure Margin:</strong> Additional safety requirement
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="benefits">
          <AccordionTrigger>Benefits of Margin Trading</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Higher potential returns through leverage</li>
              <li>Ability to take larger positions</li>
              <li>Portfolio diversification opportunities</li>
              <li>Short-selling possibilities</li>
              <li>Access to more trading strategies</li>
              <li>Better capital efficiency</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="risks">
          <AccordionTrigger>Risks and Considerations</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Amplified losses due to leverage</li>
              <li>Margin calls risk</li>
              <li>Interest charges on borrowed funds</li>
              <li>Forced liquidation possibility</li>
              <li>Market volatility impact</li>
              <li>Emotional trading risks</li>
              <li>Higher responsibility and monitoring needed</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="top-brokers">
          <AccordionTrigger>Top Brokers and Margin Offerings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {topBrokers.map((broker, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{broker.name}</span>
                    <span className="text-muted-foreground">
                      Margin: {broker.margin}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {broker.features}
                  </p>
                </div>
              ))}
              <p className="text-sm text-muted-foreground mt-4">
                *Margin rates and features may vary based on client category and
                market conditions
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="regulations">
          <AccordionTrigger>Regulatory Framework</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                SEBI Guidelines:
                <ul className="list-disc pl-6 mt-1">
                  <li>VaR + ELM margin requirements</li>
                  <li>Peak margin reporting</li>
                  <li>Margin pledge mechanism</li>
                </ul>
              </li>
              <li>
                Exchange Requirements:
                <ul className="list-disc pl-6 mt-1">
                  <li>SPAN margin for derivatives</li>
                  <li>Exposure limits</li>
                  <li>Circuit filters</li>
                </ul>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="strategies">
          <AccordionTrigger>Trading Strategies</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Risk Management:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Position sizing</li>
                  <li>Stop-loss placement</li>
                  <li>Diversification</li>
                </ul>
              </li>
              <li>
                <strong>Leverage Management:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Optimal margin utilization</li>
                  <li>Buffer maintenance</li>
                  <li>Regular monitoring</li>
                </ul>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="best-practices">
          <AccordionTrigger>Best Practices</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Never use maximum available leverage</li>
              <li>Maintain adequate cash buffer</li>
              <li>Use stop-loss orders</li>
              <li>Monitor positions regularly</li>
              <li>Understand margin requirements fully</li>
              <li>Have a clear exit strategy</li>
              <li>Keep track of funding costs</li>
              <li>Consider market volatility</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default MarginInformation;
