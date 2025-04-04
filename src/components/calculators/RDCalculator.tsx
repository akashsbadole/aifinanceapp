import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BaseCalculator from './BaseCalculator';

const RDCalculator = () => {
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<string>('');
  const [result, setResult] = useState<{
    totalDeposit: number;
    totalInterest: number;
    maturityAmount: number;
    quarterlyBreakdown: Array<{
      quarter: number;
      deposit: number;
      interest: number;
      balance: number;
    }>;
  } | null>(null);

  const calculateRD = () => {
    const deposit = parseFloat(monthlyDeposit);
    const rate = parseFloat(interestRate) / 100;
    const years = parseFloat(timePeriod);
    
    const quarterlyRate = rate / 4; // Quarterly compounding
    const totalQuarters = years * 4;
    const monthsPerQuarter = 3;
    
    let totalDeposit = 0;
    let balance = 0;
    const quarterlyBreakdown = [];

    // Calculate quarter by quarter
    for (let quarter = 1; quarter <= totalQuarters; quarter++) {
      const quarterlyDeposit = deposit * monthsPerQuarter;
      totalDeposit += quarterlyDeposit;

      // Add deposits for this quarter
      balance += quarterlyDeposit;
      
      // Calculate interest for this quarter
      const quarterlyInterest = balance * quarterlyRate;
      balance += quarterlyInterest;

      quarterlyBreakdown.push({
        quarter,
        deposit: quarterlyDeposit,
        interest: quarterlyInterest,
        balance: balance
      });
    }

    const totalInterest = balance - totalDeposit;

    setResult({
      totalDeposit,
      totalInterest,
      maturityAmount: balance,
      quarterlyBreakdown
    });
  };

  return (
    <BaseCalculator title="Recurring Deposit (RD) Calculator">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="monthlyDeposit">Monthly Deposit (₹)</Label>
          <Input
            id="monthlyDeposit"
            type="number"
            value={monthlyDeposit}
            onChange={(e) => setMonthlyDeposit(e.target.value)}
            placeholder="Enter monthly deposit amount"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="interestRate">Interest Rate (% p.a.)</Label>
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

        <Button onClick={calculateRD}>Calculate Returns</Button>

        {result && (
          <div className="mt-6 space-y-6">
            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="font-semibold text-lg">Total Deposit</h3>
                  <p className="text-2xl font-bold text-primary">₹{result.totalDeposit.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Total Interest</h3>
                  <p className="text-2xl font-bold text-primary">₹{result.totalInterest.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Maturity Amount</h3>
                  <p className="text-2xl font-bold text-primary">₹{result.maturityAmount.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-4">Quarterly Breakdown</h3>
                <div className="grid gap-4">
                  {result.quarterlyBreakdown.map((quarter) => (
                    <div key={quarter.quarter} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                      <div>
                        <h4 className="text-sm text-muted-foreground">Quarter {quarter.quarter}</h4>
                        <p className="font-semibold">Deposit</p>
                        <p className="text-primary">₹{quarter.deposit.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Interest</p>
                        <p className="text-primary">₹{quarter.interest.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Balance</p>
                        <p className="text-primary">₹{quarter.balance.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>Important Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Interest is compounded quarterly</li>
                <li>TDS of 10% applies if interest earned exceeds ₹40,000 per year (₹50,000 for senior citizens)</li>
                <li>Premature withdrawal may result in lower interest rates</li>
                <li>Interest rates are subject to change as per RBI guidelines</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </BaseCalculator>
  );
};

export default RDCalculator;