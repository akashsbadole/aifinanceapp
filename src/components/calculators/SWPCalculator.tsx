import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BaseCalculator from './BaseCalculator';

const SWPCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState<string>('');
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<string>('');
  const [expectedReturn, setExpectedReturn] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<string>('');
  const [result, setResult] = useState<{
    totalWithdrawal: number;
    remainingAmount: number;
    totalReturns: number;
    yearWiseBalance: Array<{
      year: number;
      balance: number;
      withdrawal: number;
      returns: number;
    }>;
  } | null>(null);

  const calculateSWP = () => {
    const principal = parseFloat(initialInvestment);
    const withdrawal = parseFloat(monthlyWithdrawal);
    const returnRate = parseFloat(expectedReturn) / 100;
    const years = parseFloat(timePeriod);
    
    let currentBalance = principal;
    let totalWithdrawal = 0;
    let totalReturns = 0;
    const yearWiseBalance = [];
    
    const monthlyRate = returnRate / 12;
    const totalMonths = years * 12;

    for (let year = 1; year <= years; year++) {
      let yearlyWithdrawal = 0;
      let yearlyReturns = 0;

      // Calculate for each month in the year
      for (let month = 1; month <= 12; month++) {
        if (currentBalance <= 0) break;

        // Calculate returns for this month
        const monthlyReturn = currentBalance * monthlyRate;
        yearlyReturns += monthlyReturn;

        // Add returns to balance
        currentBalance += monthlyReturn;

        // Subtract withdrawal if there's enough balance
        if (currentBalance >= withdrawal) {
          currentBalance -= withdrawal;
          yearlyWithdrawal += withdrawal;
        } else {
          yearlyWithdrawal += currentBalance;
          currentBalance = 0;
          break;
        }
      }

      totalWithdrawal += yearlyWithdrawal;
      totalReturns += yearlyReturns;

      yearWiseBalance.push({
        year,
        balance: currentBalance,
        withdrawal: yearlyWithdrawal,
        returns: yearlyReturns
      });

      if (currentBalance <= 0) break;
    }

    setResult({
      totalWithdrawal,
      remainingAmount: currentBalance,
      totalReturns,
      yearWiseBalance
    });
  };

  return (
    <BaseCalculator title="Systematic Withdrawal Plan (SWP) Calculator">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="initialInvestment">Initial Investment (₹)</Label>
          <Input
            id="initialInvestment"
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
            placeholder="Enter initial investment amount"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="monthlyWithdrawal">Monthly Withdrawal (₹)</Label>
          <Input
            id="monthlyWithdrawal"
            type="number"
            value={monthlyWithdrawal}
            onChange={(e) => setMonthlyWithdrawal(e.target.value)}
            placeholder="Enter monthly withdrawal amount"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
          <Input
            id="expectedReturn"
            type="number"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            placeholder="Enter expected annual return"
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

        <Button onClick={calculateSWP}>Calculate SWP</Button>

        {result && (
          <div className="mt-6 space-y-6">
            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="font-semibold text-lg">Total Withdrawal</h3>
                  <p className="text-2xl font-bold text-primary">₹{result.totalWithdrawal.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Total Returns</h3>
                  <p className="text-2xl font-bold text-primary">₹{result.totalReturns.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Remaining Amount</h3>
                  <p className="text-2xl font-bold text-primary">₹{result.remainingAmount.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-4">Year-wise Details</h3>
                <div className="grid gap-4">
                  {result.yearWiseBalance.map((year) => (
                    <div key={year.year} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                      <div>
                        <h4 className="text-sm text-muted-foreground">Year {year.year}</h4>
                        <p className="font-semibold">Balance</p>
                        <p className="text-primary">₹{year.balance.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Withdrawal</p>
                        <p className="text-primary">₹{year.withdrawal.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Returns</p>
                        <p className="text-primary">₹{year.returns.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </BaseCalculator>
  );
};

export default SWPCalculator;