import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BaseCalculator from './BaseCalculator';

const MutualFundCalculator = () => {
  // Lump Sum State
  const [lumpSumAmount, setLumpSumAmount] = useState<string>('');
  const [lumpSumReturn, setLumpSumReturn] = useState<string>('');
  const [lumpSumPeriod, setLumpSumPeriod] = useState<string>('');

  // SIP State
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>('');
  const [sipReturn, setSipReturn] = useState<string>('');
  const [sipPeriod, setSipPeriod] = useState<string>('');

  // Results State
  const [lumpSumResult, setLumpSumResult] = useState<{
    investedAmount: number;
    totalValue: number;
    totalReturns: number;
    absoluteReturn: number;
    cagr: number;
  } | null>(null);

  const [sipResult, setSipResult] = useState<{
    totalInvestment: number;
    totalValue: number;
    totalReturns: number;
    xirr: number;
    yearlyBreakdown: Array<{
      year: number;
      investment: number;
      value: number;
      returns: number;
    }>;
  } | null>(null);

  const calculateLumpSum = () => {
    const principal = parseFloat(lumpSumAmount);
    const rate = parseFloat(lumpSumReturn) / 100;
    const years = parseFloat(lumpSumPeriod);

    const totalValue = principal * Math.pow(1 + rate, years);
    const totalReturns = totalValue - principal;
    const absoluteReturn = (totalReturns / principal) * 100;
    const cagr = (Math.pow(totalValue / principal, 1 / years) - 1) * 100;

    setLumpSumResult({
      investedAmount: principal,
      totalValue,
      totalReturns,
      absoluteReturn,
      cagr
    });
  };

  const calculateSIP = () => {
    const monthly = parseFloat(monthlyInvestment);
    const rate = parseFloat(sipReturn) / 100;
    const years = parseFloat(sipPeriod);
    
    const monthlyRate = rate / 12;
    const months = years * 12;
    const totalInvestment = monthly * months;

    let totalValue = 0;
    const yearlyBreakdown = [];

    // Calculate year by year
    for (let year = 1; year <= years; year++) {
      let yearlyInvestment = monthly * 12;
      let yearStartValue = totalValue;

      // Calculate monthly compounding for this year
      for (let month = 1; month <= 12; month++) {
        totalValue = (totalValue + monthly) * (1 + monthlyRate);
      }

      yearlyBreakdown.push({
        year,
        investment: yearlyInvestment,
        value: totalValue,
        returns: totalValue - yearStartValue - yearlyInvestment
      });
    }

    // Calculate XIRR (approximation using simplified method)
    const totalReturns = totalValue - totalInvestment;
    const xirr = ((Math.pow(totalValue / totalInvestment, 1 / years) - 1) * 100);

    setSipResult({
      totalInvestment,
      totalValue,
      totalReturns,
      xirr,
      yearlyBreakdown
    });
  };

  return (
    <BaseCalculator title="Mutual Fund Returns Calculator">
      <Tabs defaultValue="lumpsum" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lumpsum">Lump Sum Investment</TabsTrigger>
          <TabsTrigger value="sip">SIP Investment</TabsTrigger>
        </TabsList>

        <TabsContent value="lumpsum">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lumpSumAmount">Investment Amount (₹)</Label>
              <Input
                id="lumpSumAmount"
                type="number"
                value={lumpSumAmount}
                onChange={(e) => setLumpSumAmount(e.target.value)}
                placeholder="Enter investment amount"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lumpSumReturn">Expected Return (% p.a.)</Label>
              <Input
                id="lumpSumReturn"
                type="number"
                value={lumpSumReturn}
                onChange={(e) => setLumpSumReturn(e.target.value)}
                placeholder="Enter expected return"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lumpSumPeriod">Investment Period (Years)</Label>
              <Input
                id="lumpSumPeriod"
                type="number"
                value={lumpSumPeriod}
                onChange={(e) => setLumpSumPeriod(e.target.value)}
                placeholder="Enter investment period"
              />
            </div>

            <Button onClick={calculateLumpSum}>Calculate Returns</Button>

            {lumpSumResult && (
              <Card>
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <h3 className="font-semibold text-lg">Invested Amount</h3>
                    <p className="text-2xl font-bold text-primary">₹{lumpSumResult.investedAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Total Value</h3>
                    <p className="text-2xl font-bold text-primary">₹{lumpSumResult.totalValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Total Returns</h3>
                    <p className="text-2xl font-bold text-primary">₹{lumpSumResult.totalReturns.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Absolute Return</h3>
                    <p className="text-2xl font-bold text-primary">{lumpSumResult.absoluteReturn.toFixed(2)}%</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">CAGR</h3>
                    <p className="text-2xl font-bold text-primary">{lumpSumResult.cagr.toFixed(2)}%</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sip">
          <div className="grid gap-4">
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
              <Label htmlFor="sipReturn">Expected Return (% p.a.)</Label>
              <Input
                id="sipReturn"
                type="number"
                value={sipReturn}
                onChange={(e) => setSipReturn(e.target.value)}
                placeholder="Enter expected return"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sipPeriod">Investment Period (Years)</Label>
              <Input
                id="sipPeriod"
                type="number"
                value={sipPeriod}
                onChange={(e) => setSipPeriod(e.target.value)}
                placeholder="Enter investment period"
              />
            </div>

            <Button onClick={calculateSIP}>Calculate Returns</Button>

            {sipResult && (
              <div className="space-y-6">
                <Card>
                  <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <h3 className="font-semibold text-lg">Total Investment</h3>
                      <p className="text-2xl font-bold text-primary">₹{sipResult.totalInvestment.toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Total Value</h3>
                      <p className="text-2xl font-bold text-primary">₹{sipResult.totalValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Total Returns</h3>
                      <p className="text-2xl font-bold text-primary">₹{sipResult.totalReturns.toFixed(2)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">XIRR</h3>
                      <p className="text-2xl font-bold text-primary">{sipResult.xirr.toFixed(2)}%</p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Year-wise Breakdown</h3>
                    <div className="grid gap-4">
                      {sipResult.yearlyBreakdown.map((year) => (
                        <div key={year.year} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                          <div>
                            <h4 className="text-sm text-muted-foreground">Year {year.year}</h4>
                            <p className="font-semibold">Investment</p>
                            <p className="text-primary">₹{year.investment.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Value</p>
                            <p className="text-primary">₹{year.value.toFixed(2)}</p>
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
        </TabsContent>
      </Tabs>
    </BaseCalculator>
  );
};

export default MutualFundCalculator;