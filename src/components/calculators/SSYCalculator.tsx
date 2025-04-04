import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BaseCalculator from './BaseCalculator';

const SSYCalculator = () => {
  const [yearlyInvestment, setYearlyInvestment] = useState<string>('');
  const [girlAge, setGirlAge] = useState<string>('');
  const [result, setResult] = useState<{
    totalInvestment: number;
    maturityAmount: number;
    totalInterest: number;
    yearlyBreakdown: Array<{
      year: number;
      investment: number;
      interest: number;
      balance: number;
    }>;
  } | null>(null);

  // Current SSY interest rate (8.0% for 2023-24)
  const interestRate = 0.08;

  const calculateSSY = () => {
    const investment = parseFloat(yearlyInvestment);
    const age = parseFloat(girlAge);
    
    if (age > 10) {
      alert("Girl's age should not be more than 10 years for opening SSY account");
      return;
    }

    // Investment period is 15 years, maturity after 21 years
    const investmentYears = 15;
    const maturityYears = 21;
    
    let totalInvestment = 0;
    let balance = 0;
    const yearlyBreakdown = [];

    // Calculate for 21 years
    for (let year = 1; year <= maturityYears; year++) {
      let yearlyInvestment = 0;
      
      // Add investment for first 15 years only
      if (year <= investmentYears) {
        yearlyInvestment = investment;
        totalInvestment += yearlyInvestment;
      }

      // Calculate interest for the year
      const yearStartBalance = balance;
      const interest = (yearStartBalance + yearlyInvestment) * interestRate;
      
      // Update balance
      balance = yearStartBalance + yearlyInvestment + interest;

      yearlyBreakdown.push({
        year,
        investment: yearlyInvestment,
        interest,
        balance
      });
    }

    const totalInterest = balance - totalInvestment;

    setResult({
      totalInvestment,
      maturityAmount: balance,
      totalInterest,
      yearlyBreakdown
    });
  };

  return (
    <BaseCalculator title="Sukanya Samriddhi Yojana (SSY) Calculator">
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
            Maximum yearly investment limit: ₹1,50,000
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="girlAge">Girl's Age (Years)</Label>
          <Input
            id="girlAge"
            type="number"
            value={girlAge}
            onChange={(e) => setGirlAge(e.target.value)}
            placeholder="Enter girl's age"
          />
          <p className="text-sm text-muted-foreground">
            Account can be opened before girl turns 10 years old
          </p>
        </div>

        <Button onClick={calculateSSY}>Calculate Returns</Button>

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
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>Important Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Account matures after 21 years from the date of opening</li>
                <li>Deposits can be made for 15 years only</li>
                <li>50% withdrawal is allowed after the girl turns 18</li>
                <li>Interest rate is subject to change quarterly by the government</li>
                <li>Current interest rate: 8.0% (2023-24)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </BaseCalculator>
  );
};

export default SSYCalculator;