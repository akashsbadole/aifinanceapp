import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BaseCalculator from "./BaseCalculator";
import SWPInformation from "./information/SWPInformation";

const SWPCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState<string>("");
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<string>("");
  const [expectedReturn, setExpectedReturn] = useState<string>("");
  const [timePeriod, setTimePeriod] = useState<string>("");
  const [result, setResult] = useState<{
    initialInvestment: number;
    totalWithdrawal: number;
    remainingCorpus: number;
    yearlyBreakdown: Array<{
      year: number;
      startBalance: number;
      withdrawal: number;
      returns: number;
      endBalance: number;
    }>;
  } | null>(null);

  const calculateSWP = () => {
    const P = parseFloat(initialInvestment);
    const W = parseFloat(monthlyWithdrawal);
    const r = parseFloat(expectedReturn) / (12 * 100); // Monthly rate
    const t = parseFloat(timePeriod) * 12; // Total months

    let balance = P;
    let totalWithdrawal = 0;
    const yearlyBreakdown = [];

    for (let year = 1; year <= parseFloat(timePeriod); year++) {
      const yearStartBalance = balance;
      let yearWithdrawal = 0;

      // Calculate monthly for this year
      for (let month = 1; month <= 12; month++) {
        if (balance >= W) {
          balance = (balance - W) * (1 + r);
          yearWithdrawal += W;
          totalWithdrawal += W;
        } else {
          break;
        }
      }

      const yearEndBalance = balance;
      const yearReturns = yearEndBalance - yearStartBalance + yearWithdrawal;

      yearlyBreakdown.push({
        year,
        startBalance: yearStartBalance,
        withdrawal: yearWithdrawal,
        returns: yearReturns,
        endBalance: yearEndBalance,
      });
    }

    setResult({
      initialInvestment: P,
      totalWithdrawal,
      remainingCorpus: balance,
      yearlyBreakdown,
    });
  };

  return (
    <BaseCalculator title="Systematic Withdrawal Plan (SWP) Calculator">
      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="initialInvestment">
              Initial Investment Amount (₹)
            </Label>
            <Input
              id="initialInvestment"
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
              placeholder="Enter initial investment amount"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="monthlyWithdrawal">
              Monthly Withdrawal Amount (₹)
            </Label>
            <Input
              id="monthlyWithdrawal"
              type="number"
              value={monthlyWithdrawal}
              onChange={(e) => setMonthlyWithdrawal(e.target.value)}
              placeholder="Enter monthly withdrawal amount"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expectedReturn">
              Expected Return (% per annum)
            </Label>
            <Input
              id="expectedReturn"
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              placeholder="Enter expected annual return"
            />
            <p className="text-sm text-muted-foreground">
              Historical returns: Equity: 12-15%, Hybrid: 9-12%, Debt: 6-8%
            </p>
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
          <Button onClick={calculateSWP}>Calculate Returns</Button>
        </div>

        {result && (
          <div className="space-y-6">
            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="font-semibold text-lg">Initial Investment</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.initialInvestment.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Total Withdrawal</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.totalWithdrawal.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Remaining Corpus</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.remainingCorpus.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-4">
                  Year-wise Breakdown
                </h3>
                <div className="space-y-4">
                  {result.yearlyBreakdown.map((year) => (
                    <div
                      key={year.year}
                      className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="text-sm text-muted-foreground">
                          Year {year.year}
                        </h4>
                        <p className="font-semibold">Opening Balance</p>
                        <p className="text-primary">
                          ₹{year.startBalance.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Withdrawal</p>
                        <p className="text-primary">
                          ₹{year.withdrawal.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Returns</p>
                        <p className="text-primary">
                          ₹{year.returns.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Closing Balance</p>
                        <p className="text-primary">
                          ₹{year.endBalance.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        <SWPInformation />
      </div>
    </BaseCalculator>
  );
};

export default SWPCalculator;
