import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BaseCalculator from './BaseCalculator';

const FDCalculator = () => {
  const [principal, setPrincipal] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<string>('');
  const [result, setResult] = useState<{
    maturityAmount: number;
    totalInterest: number;
  } | null>(null);

  const calculateFD = () => {
    const P = parseFloat(principal);
    const r = parseFloat(interestRate) / 100;
    const t = parseFloat(timePeriod);
    
    // Simple Interest calculation for FD
    const interest = P * r * t;
    const maturityAmount = P + interest;

    setResult({
      maturityAmount,
      totalInterest: interest,
    });
  };

  return (
    <BaseCalculator title="Fixed Deposit (FD) Calculator">
      <div className="grid gap-2">
        <Label htmlFor="principal">Principal Amount (₹)</Label>
        <Input
          id="principal"
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          placeholder="Enter principal amount"
        />
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
        />
      </div>
      <Button onClick={calculateFD}>Calculate Returns</Button>

      {result && (
        <div className="mt-6">
          <Card>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div>
                <h3 className="font-semibold text-lg">Maturity Amount</h3>
                <p className="text-2xl font-bold text-primary">₹{result.maturityAmount.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Total Interest Earned</h3>
                <p className="text-2xl font-bold text-primary">₹{result.totalInterest.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </BaseCalculator>
  );
};

export default FDCalculator;