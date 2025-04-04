import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CalculatorHeader from "./CalculatorHeader";
import CalculatorFooter from "./CalculatorFooter";
import MutualFundInformation from "./information/MutualFundInformation";

interface CalculationResult {
  futureValue: number;
  totalInvestment: number;
  returns: number;
  cagr: number;
}

const MutualFundCalculator = () => {
  const [investmentType, setInvestmentType] = useState<"lumpsum" | "sip">(
    "lumpsum"
  );
  const [amount, setAmount] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [expectedReturn, setExpectedReturn] = useState<string>("");
  const [frequency, setFrequency] = useState<
    "monthly" | "quarterly" | "yearly"
  >("monthly");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateReturns = () => {
    const principal = parseFloat(amount);
    const years = parseFloat(duration);
    const rate = parseFloat(expectedReturn) / 100;

    if (investmentType === "lumpsum") {
      const futureValue = principal * Math.pow(1 + rate, years);
      const returns = futureValue - principal;
      const cagr = (Math.pow(futureValue / principal, 1 / years) - 1) * 100;

      setResult({
        futureValue,
        totalInvestment: principal,
        returns,
        cagr,
      });
    } else {
      let periodsPerYear =
        frequency === "monthly" ? 12 : frequency === "quarterly" ? 4 : 1;
      let totalPeriods = years * periodsPerYear;
      let ratePerPeriod = rate / periodsPerYear;

      const futureValue =
        principal *
        ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod) *
        (1 + ratePerPeriod);
      const totalInvestment = principal * totalPeriods;
      const returns = futureValue - totalInvestment;
      const cagr =
        (Math.pow(futureValue / totalInvestment, 1 / years) - 1) * 100;

      setResult({
        futureValue,
        totalInvestment,
        returns,
        cagr,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <CalculatorHeader
        title="Mutual Fund Calculator"
        description="Calculate potential returns on your mutual fund investments through lump sum or SIP investments."
      />

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label>Investment Type</Label>
            <Select
              value={investmentType}
              onValueChange={(value: "lumpsum" | "sip") =>
                setInvestmentType(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select investment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lumpsum">Lump Sum</SelectItem>
                <SelectItem value="sip">SIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {investmentType === "sip" && (
            <div className="flex flex-col space-y-2">
              <Label>Frequency</Label>
              <Select
                value={frequency}
                onValueChange={(value: "monthly" | "quarterly" | "yearly") =>
                  setFrequency(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <Label>
              {investmentType === "lumpsum"
                ? "Investment Amount"
                : "Installment Amount"}{" "}
              (₹)
            </Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Investment Duration (Years)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Expected Annual Return (%)</Label>
            <Input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              placeholder="Enter expected return"
            />
          </div>

          <Button
            onClick={calculateReturns}
            className="w-full"
            disabled={!amount || !duration || !expectedReturn}
          >
            Calculate
          </Button>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm font-medium">Future Value</p>
                <p className="text-lg font-bold">
                  ₹{result.futureValue.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm font-medium">Total Investment</p>
                <p className="text-lg font-bold">
                  ₹{result.totalInvestment.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm font-medium">Total Returns</p>
                <p className="text-lg font-bold">
                  ₹{result.returns.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm font-medium">CAGR</p>
                <p className="text-lg font-bold">{result.cagr.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <MutualFundInformation />

      <CalculatorFooter />
    </div>
  );
};

export default MutualFundCalculator;
