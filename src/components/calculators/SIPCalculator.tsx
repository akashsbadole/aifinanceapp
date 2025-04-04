import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import BaseCalculator from './BaseCalculator';
import SIPInformation from './information/SIPInformation';

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>('');
  const [expectedReturn, setExpectedReturn] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<string>('');
  const [result, setResult] = useState<{
    totalInvestment: number;
    totalReturns: number;
    maturityValue: number;
  } | null>(null);

  const calculateSIP = () => {
    const P = parseFloat(monthlyInvestment);
    const r = parseFloat(expectedReturn) / (12 * 100); // Monthly rate
    const t = parseFloat(timePeriod) * 12; // Time in months
    
    const maturityValue = P * ((Math.pow(1 + r, t) - 1) / r) * (1 + r);
    const totalInvestment = P * t;
    const totalReturns = maturityValue - totalInvestment;

    setResult({
      totalInvestment,
      totalReturns,
      maturityValue,
    });
  };

  return (
    <BaseCalculator title="SIP Calculator">
      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="monthlyInvestment">Monthly Investment (₹)</Label>
            <Input
              id="monthlyInvestment"
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              placeholder="Enter monthly investment amount"
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
            <Label htmlFor="timePeriod">Investment Time Period (Years)</Label>
            <Input
              id="timePeriod"
              type="number"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              placeholder="Enter time period"
            />
          </div>
          <Button onClick={calculateSIP}>Calculate Returns</Button>
        </div>

        {result && (
          <div className="mt-6">
            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h3 className="font-semibold text-lg">Total Investment</h3>
                  <p className="text-2xl font-bold text-primary">₹{result.totalInvestment.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Total Returns</h3>
                  <p className="text-2xl font-bold text-primary">₹{result.totalReturns.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Maturity Value</h3>
                  <p className="text-2xl font-bold text-primary">₹{result.maturityValue.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <SIPInformation />
      </div>
    </BaseCalculator>
  );
};

export default SIPCalculator;