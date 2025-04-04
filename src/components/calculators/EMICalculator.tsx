import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BaseCalculator from "./BaseCalculator";
import EMIInformation from "./information/EMIInformation";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTenure, setLoanTenure] = useState<string>("");
  const [result, setResult] = useState<{
    emi: number;
    totalInterest: number;
    totalPayment: number;
  } | null>(null);

  const calculateEMI = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / (12 * 100); // Monthly interest rate
    const n = parseFloat(loanTenure) * 12; // Total number of months

    // EMI calculation formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    setResult({
      emi,
      totalInterest,
      totalPayment,
    });
  };

  return (
    <BaseCalculator title="EMI Calculator">
      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
            <Input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter loan amount"
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
            <Label htmlFor="loanTenure">Loan Tenure (Years)</Label>
            <Input
              id="loanTenure"
              type="number"
              value={loanTenure}
              onChange={(e) => setLoanTenure(e.target.value)}
              placeholder="Enter loan tenure"
            />
          </div>
          <Button onClick={calculateEMI}>Calculate EMI</Button>
        </div>

        {result && (
          <div className="mt-6">
            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="font-semibold text-lg">Monthly EMI</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.emi.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Total Interest</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.totalInterest.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Total Payment</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.totalPayment.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <EMIInformation />
      </div>
    </BaseCalculator>
  );
};

export default EMICalculator;
