import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BaseCalculator from "./BaseCalculator";
import PPFInformation from "./information/PPFInformation";

const PPFCalculator = () => {
  const [yearlyInvestment, setYearlyInvestment] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("7.1"); // Current PPF rate
  const [timePeriod, setTimePeriod] = useState<string>("15"); // Default PPF period
  const [result, setResult] = useState<{
    totalInvestment: number;
    totalInterest: number;
    maturityValue: number;
  } | null>(null);

  const calculatePPF = () => {
    const P = parseFloat(yearlyInvestment);
    const r = parseFloat(interestRate) / 100;
    const t = parseFloat(timePeriod);

    let totalAmount = 0;
    let totalInvestment = P * t;

    // PPF uses annual compounding
    for (let i = 0; i < t; i++) {
      totalAmount = (totalAmount + P) * (1 + r);
    }

    const totalInterest = totalAmount - totalInvestment;

    setResult({
      totalInvestment,
      totalInterest,
      maturityValue: totalAmount,
    });
  };

  return (
    <BaseCalculator title="PPF Calculator">
      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="yearlyInvestment">Yearly Investment (₹)</Label>
            <Input
              id="yearlyInvestment"
              type="number"
              value={yearlyInvestment}
              onChange={(e) => setYearlyInvestment(e.target.value)}
              placeholder="Enter yearly investment amount"
              min="500"
              max="150000"
            />
            <p className="text-sm text-muted-foreground">
              Min: ₹500, Max: ₹1,50,000 per year
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Current PPF interest rate"
            />
            <p className="text-sm text-muted-foreground">
              Current rate: 7.1% (Updated quarterly)
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="timePeriod">Time Period (Years)</Label>
            <Input
              id="timePeriod"
              type="number"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              placeholder="Investment duration"
              min="15"
              step="5"
            />
            <p className="text-sm text-muted-foreground">
              Minimum 15 years, extendable by 5 years
            </p>
          </div>
          <Button onClick={calculatePPF}>Calculate Returns</Button>
        </div>

        {result && (
          <div className="mt-6">
            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="font-semibold text-lg">Total Investment</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.totalInvestment.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Total Interest</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.totalInterest.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Maturity Value</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.maturityValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <PPFInformation />
      </div>
    </BaseCalculator>
  );
};

export default PPFCalculator;
