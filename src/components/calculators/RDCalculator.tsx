import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BaseCalculator from "./BaseCalculator";
import RDInformation from "./information/RDInformation";

const RDCalculator = () => {
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [timePeriod, setTimePeriod] = useState<string>("");
  const [result, setResult] = useState<{
    totalDeposit: number;
    totalInterest: number;
    maturityValue: number;
  } | null>(null);

  const calculateRD = () => {
    const P = parseFloat(monthlyDeposit);
    const r = parseFloat(interestRate) / 400; // Quarterly rate (annual rate / 4 / 100)
    const n = parseFloat(timePeriod) * 4; // Number of quarters

    let totalDeposit = P * parseFloat(timePeriod) * 12;
    let maturityValue = 0;

    // RD uses quarterly compounding
    for (let i = 0; i < parseFloat(timePeriod) * 12; i++) {
      maturityValue += P * Math.pow(1 + r, n - Math.floor(i / 3));
    }

    const totalInterest = maturityValue - totalDeposit;

    setResult({
      totalDeposit,
      totalInterest,
      maturityValue,
    });
  };

  return (
    <BaseCalculator title="Recurring Deposit Calculator">
      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="monthlyDeposit">Monthly Deposit (₹)</Label>
            <Input
              id="monthlyDeposit"
              type="number"
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(e.target.value)}
              placeholder="Enter monthly deposit amount"
              min="100"
            />
            <p className="text-sm text-muted-foreground">
              Minimum ₹100 per month
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Enter interest rate"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="timePeriod">Time Period (Years)</Label>
            <Input
              id="timePeriod"
              type="number"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              placeholder="Enter time period"
              min="0.5"
              max="10"
              step="0.5"
            />
            <p className="text-sm text-muted-foreground">
              6 months to 10 years
            </p>
          </div>
          <Button onClick={calculateRD}>Calculate Returns</Button>
        </div>

        {result && (
          <div className="mt-6">
            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="font-semibold text-lg">Total Deposit</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.totalDeposit.toFixed(2)}
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

        <RDInformation />
      </div>
    </BaseCalculator>
  );
};

export default RDCalculator;
