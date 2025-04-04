import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BaseCalculator from './BaseCalculator';

const PPFCalculator = () => {
  const [yearlyInvestment, setYearlyInvestment] = useState<string>('');
  const [initialBalance, setInitialBalance] = useState<string>('');
  const [result, setResult] = useState<{
    totalInvestment: number;
    totalInterest: number;
    maturityAmount: number;
    yearlyBreakdown: Array<{
      year: number;
      investment: number;
      interest: number;
      balance: number;
      loanLimit?: number;
      withdrawalLimit?: number;
    }>;
  } | null>(null);

  // Current PPF interest rate (7.1% for 2023-24)
  const interestRate = 0.071;

  const calculatePPF = () => {
    const investment = Math.min(Math.max(parseFloat(yearlyInvestment), 500), 150000); // Min 500, Max 1.5L
    const initialBal = parseFloat(initialBalance) || 0;
    const years = 15; // Fixed 15-year tenure
    
    let totalInvestment = initialBal;
    let balance = initialBal;
    const yearlyBreakdown = [];

    for (let year = 1; year <= years; year++) {
      // Add yearly investment
      balance += investment;
      totalInvestment += investment;

      // Calculate interest for the year
      const yearlyInterest = balance * interestRate;
      balance += yearlyInterest;

      // Calculate loan and withdrawal limits
      // Loan available from 3rd year to 6th year
      const loanLimit = year >= 3 && year <= 6 ? balance * 0.25 : undefined;
      // Withdrawal available from 7th year onwards
      const withdrawalLimit = year >= 7 ? balance * 0.5 : undefined;

      yearlyBreakdown.push({
        year,
        investment,
        interest: yearlyInterest,
        balance,
        loanLimit,
        withdrawalLimit
      });
    }

    const totalInterest = balance - totalInvestment;

    setResult({
      totalInvestment,
      totalInterest,
      maturityAmount: balance,
      yearlyBreakdown
    });
  };

  return (
    <BaseCalculator title="Public Provident Fund (PPF) Calculator">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="yearlyInvestment">Yearly Investment (₹)</Label>
          <Input
            id="yearlyInvestment"
            type="number"
            value={yearlyInvestment}
            onChange={(e) => setYearlyInvestment(e.target.value)}
            placeholder="Enter yearly investment amount"
          />
          <p className="text-sm text-muted-foreground">
            Min: ₹500, Max: ₹1,50,000 per financial year
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="initialBalance">Initial Balance (₹)</Label>
          <Input
            id="initialBalance"
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            placeholder="Enter initial balance (if any)"
          />
        </div>

        <Button onClick={calculatePPF}>Calculate Returns</Button>

        {result && (
          <div className="mt-6 space-y-6">
            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="font-semibold text-lg">Total Investment</h3>
                  <p className="text-2xl font-bold text-primary">₹{result.totalInvestment.toFixed(2)}</p>
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
                <h3 className="font-semibold text-lg mb-4">Year-wise Details</h3>
                <div className="grid gap-4">
                  {result.yearlyBreakdown.map((year) => (
                    <div key={year.year} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                      <div>
                        <h4 className="text-sm text-muted-foreground">Year {year.year}</h4>
                        <p className="font-semibold">Investment</p>
                        <p className="text-primary">₹{year.investment.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Interest Earned</p>
                        <p className="text-primary">₹{year.interest.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Balance</p>
                        <p className="text-primary">₹{year.balance.toFixed(2)}</p>
                      </div>
                      <div>
                        {year.loanLimit && (
                          <div>
                            <p className="font-semibold">Loan Limit</p>
                            <p className="text-primary">₹{year.loanLimit.toFixed(2)}</p>
                          </div>
                        )}
                        {year.withdrawalLimit && (
                          <div>
                            <p className="font-semibold">Withdrawal Limit</p>
                            <p className="text-primary">₹{year.withdrawalLimit.toFixed(2)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>Important Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>15-year lock-in period with extension option in blocks of 5 years</li>
                <li>Interest is tax-free and calculated on lowest balance between 5th-last day of each month</li>
                <li>Investment qualifies for tax deduction under Section 80C</li>
                <li>Loan facility available from 3rd year to 6th year</li>
                <li>Partial withdrawal allowed from 7th year onwards</li>
                <li>Current interest rate: 7.1% (2023-24)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </BaseCalculator>
  );
};

export default PPFCalculator;