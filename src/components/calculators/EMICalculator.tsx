import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTenure, setLoanTenure] = useState<string>("");
  const [emi, setEmi] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const ratePerMonth = parseFloat(interestRate) / (12 * 100);
    const months = parseFloat(loanTenure) * 12;

    const emiAmount =
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, months)) /
      (Math.pow(1 + ratePerMonth, months) - 1);
    const totalPayment = emiAmount * months;
    const totalInterestAmount = totalPayment - principal;

    setEmi(emiAmount);
    setTotalAmount(totalPayment);
    setTotalInterest(totalInterestAmount);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Loan EMI Calculator</CardTitle>
        </CardHeader>
        <CardContent>
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

            {emi && (
              <div className="mt-6 grid gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <h3 className="font-semibold text-lg">Monthly EMI</h3>
                        <p className="text-2xl font-bold text-primary">
                          ₹{emi.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Total Interest
                        </h3>
                        <p className="text-2xl font-bold text-primary">
                          ₹{totalInterest?.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Total Amount</h3>
                        <p className="text-2xl font-bold text-primary">
                          ₹{totalAmount?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EMICalculator;
