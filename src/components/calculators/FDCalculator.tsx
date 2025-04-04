import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BaseCalculator from "./BaseCalculator";
import FDInformation from "./information/FDInformation";

const FDCalculator = () => {
  const [principal, setPrincipal] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [tenure, setTenure] = useState<string>("");
  const [payoutFrequency, setPayoutFrequency] = useState<string>("maturity");
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  const [result, setResult] = useState<{
    maturityAmount: number;
    totalInterest: number;
    effectiveRate: number;
    payoutAmount: number;
  } | null>(null);

  const calculateFD = () => {
    const P = parseFloat(principal);
    let r = parseFloat(interestRate) / 100;
    const t = parseFloat(tenure);

    // Add senior citizen bonus rate if applicable
    if (isSeniorCitizen) {
      r += 0.005; // Usually 0.5% additional for senior citizens
    }

    let n = 1; // Compounding frequency
    let payoutDivisor = 1; // For periodic payouts

    // Adjust compounding frequency based on payout selection
    switch (payoutFrequency) {
      case "monthly":
        n = 12;
        payoutDivisor = 12;
        break;
      case "quarterly":
        n = 4;
        payoutDivisor = 4;
        break;
      case "halfYearly":
        n = 2;
        payoutDivisor = 2;
        break;
      case "annually":
        n = 1;
        payoutDivisor = 1;
        break;
      default: // maturity
        n = 1;
        payoutDivisor = 1;
    }

    // Calculate maturity amount using compound interest formula
    const maturityAmount =
      payoutFrequency === "maturity" ? P * Math.pow(1 + r / n, n * t) : P; // For non-cumulative FDs, principal remains same

    const totalInterest = maturityAmount - P;
    const effectiveRate = (Math.pow(maturityAmount / P, 1 / t) - 1) * 100;

    // Calculate payout amount for non-cumulative options
    const payoutAmount =
      payoutFrequency === "maturity" ? maturityAmount : (P * r) / payoutDivisor;

    setResult({
      maturityAmount,
      totalInterest,
      effectiveRate,
      payoutAmount,
    });
  };

  return (
    <BaseCalculator title="Fixed Deposit Calculator">
      <div className="space-y-6">
        <div className="grid gap-6">
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
            <Label htmlFor="interestRate">Interest Rate (% p.a.)</Label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Enter interest rate"
            />
            <p className="text-sm text-muted-foreground">
              Current FD rates range from 6.5% to 8.25% depending on bank and
              tenure
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tenure">Tenure (Years)</Label>
            <Input
              id="tenure"
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="Enter tenure in years"
              step="0.25"
            />
            <p className="text-sm text-muted-foreground">
              Enter in years (e.g., 0.5 for 6 months, 0.25 for 3 months)
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="payoutFrequency">Interest Payout Frequency</Label>
            <Select
              onValueChange={(value) => setPayoutFrequency(value)}
              defaultValue={payoutFrequency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payout frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maturity">
                  At Maturity (Cumulative)
                </SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="halfYearly">Half Yearly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="seniorCitizen"
              checked={isSeniorCitizen}
              onChange={(e) => setIsSeniorCitizen(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="seniorCitizen">
              Senior Citizen (Additional 0.5% interest)
            </Label>
          </div>

          <Button onClick={calculateFD}>Calculate Returns</Button>
        </div>

        {result && (
          <div className="mt-6">
            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <h3 className="font-semibold text-lg">Maturity Amount</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.maturityAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Total Interest</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.totalInterest.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Effective Rate</h3>
                  <p className="text-2xl font-bold text-primary">
                    {result.effectiveRate.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {payoutFrequency === "maturity"
                      ? "Maturity Payout"
                      : "Regular Payout"}
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.payoutAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <FDInformation />
      </div>
    </BaseCalculator>
  );
};

export default FDCalculator;
