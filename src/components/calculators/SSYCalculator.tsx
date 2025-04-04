import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BaseCalculator from "./BaseCalculator";
import SSYInformation from "./information/SSYInformation";

const SSYCalculator = () => {
  const [yearlyInvestment, setYearlyInvestment] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("8.0"); // Current SSY rate
  const [girlAge, setGirlAge] = useState<string>("");
  const [result, setResult] = useState<{
    totalInvestment: number;
    totalReturns: number;
    maturityValue: number;
    yearsToMaturity: number;
  } | null>(null);

  const calculateSSY = () => {
    const yearlyAmount = parseFloat(yearlyInvestment);
    const rate = parseFloat(interestRate) / 100;
    const age = parseFloat(girlAge);
    const yearsToMaturity = 21 - age;

    let totalAmount = 0;
    let totalInvestment = yearlyAmount * 15; // Investment allowed only for 15 years

    // SSY uses annual compounding
    for (let year = 1; year <= 15; year++) {
      totalAmount = (totalAmount + yearlyAmount) * (1 + rate);
    }

    // Continue compounding without investment till maturity (21 years)
    for (let year = 16; year <= yearsToMaturity; year++) {
      totalAmount = totalAmount * (1 + rate);
    }

    const totalReturns = totalAmount - totalInvestment;

    setResult({
      totalInvestment,
      totalReturns,
      maturityValue: totalAmount,
      yearsToMaturity,
    });
  };

  return (
    <BaseCalculator title="Sukanya Samriddhi Yojana (SSY) Calculator">
      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="girlAge">Girl's Current Age (Years)</Label>
            <Input
              id="girlAge"
              type="number"
              value={girlAge}
              onChange={(e) => setGirlAge(e.target.value)}
              placeholder="Enter current age"
              min="0"
              max="10"
            />
            <p className="text-sm text-muted-foreground">
              Account can be opened before age 10
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="yearlyInvestment">Yearly Investment (₹)</Label>
            <Input
              id="yearlyInvestment"
              type="number"
              value={yearlyInvestment}
              onChange={(e) => setYearlyInvestment(e.target.value)}
              placeholder="Enter yearly investment amount"
              min="250"
              max="150000"
              step="100"
            />
            <p className="text-sm text-muted-foreground">
              Min: ₹250, Max: ₹1,50,000 per year (in multiples of ₹100)
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Current SSY interest rate"
            />
            <p className="text-sm text-muted-foreground">
              Current rate: 8.0% (Updated quarterly)
            </p>
          </div>
          <Button onClick={calculateSSY}>Calculate Returns</Button>
        </div>

        {result && (
          <div className="mt-6">
            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <h3 className="font-semibold text-lg">Total Investment</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.totalInvestment.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Total Returns</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.totalReturns.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Maturity Value</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.maturityValue.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Years to Maturity</h3>
                  <p className="text-2xl font-bold text-primary">
                    {result.yearsToMaturity}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <SSYInformation />
      </div>
    </BaseCalculator>
  );
};

export default SSYCalculator;
