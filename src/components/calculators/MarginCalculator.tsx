import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BaseCalculator from './BaseCalculator';

const MarginCalculator = () => {
  const [segment, setSegment] = useState<'equity' | 'futures' | 'options'>('equity');
  const [tradeValue, setTradeValue] = useState<string>('');
  const [leverage, setLeverage] = useState<string>('');
  const [result, setResult] = useState<{
    requiredMargin: number;
    exposureMargin: number;
    spanMargin: number;
    totalMargin: number;
    maxLeverage: number;
  } | null>(null);

  const calculateMargin = () => {
    const value = parseFloat(tradeValue);
    const leverageValue = parseFloat(leverage);

    let requiredMargin = 0;
    let exposureMargin = 0;
    let spanMargin = 0;
    let maxLeverage = 0;

    switch (segment) {
      case 'equity':
        // For equity delivery, typically 100% margin is required
        // For equity intraday, typically 20% margin is required
        requiredMargin = value / leverageValue;
        exposureMargin = value * 0.05; // 5% exposure margin
        spanMargin = 0;
        maxLeverage = 5; // Typical max leverage for equity
        break;

      case 'futures':
        // For futures, SPAN + Exposure margin is required
        spanMargin = value * 0.10; // Example SPAN margin (10%)
        exposureMargin = value * 0.05; // Example exposure margin (5%)
        requiredMargin = spanMargin + exposureMargin;
        maxLeverage = 10; // Typical max leverage for futures
        break;

      case 'options':
        // For options buying, premium amount is the margin
        // For options selling, SPAN + Exposure margin is required
        spanMargin = value * 0.15; // Higher SPAN margin for options (15%)
        exposureMargin = value * 0.10; // Higher exposure margin (10%)
        requiredMargin = spanMargin + exposureMargin;
        maxLeverage = 4; // Typical max leverage for options
        break;
    }

    const totalMargin = requiredMargin + exposureMargin + spanMargin;

    setResult({
      requiredMargin,
      exposureMargin,
      spanMargin,
      totalMargin,
      maxLeverage
    });
  };

  return (
    <BaseCalculator title="Margin Calculator">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="segment">Trading Segment</Label>
          <Select value={segment} onValueChange={(value: 'equity' | 'futures' | 'options') => setSegment(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select trading segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equity">Equity</SelectItem>
              <SelectItem value="futures">Futures</SelectItem>
              <SelectItem value="options">Options</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tradeValue">Trade Value (₹)</Label>
          <Input
            id="tradeValue"
            type="number"
            value={tradeValue}
            onChange={(e) => setTradeValue(e.target.value)}
            placeholder="Enter trade value"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="leverage">Leverage (X)</Label>
          <Input
            id="leverage"
            type="number"
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            placeholder="Enter leverage"
          />
        </div>

        <Button onClick={calculateMargin}>Calculate Margin</Button>

        {result && (
          <div className="mt-6">
            <Card>
              <div className="p-6 grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Required Margin</h3>
                    <p className="text-lg font-semibold">₹{result.requiredMargin.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Exposure Margin</h3>
                    <p className="text-lg font-semibold">₹{result.exposureMargin.toFixed(2)}</p>
                  </div>
                  {segment !== 'equity' && (
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground">SPAN Margin</h3>
                      <p className="text-lg font-semibold">₹{result.spanMargin.toFixed(2)}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Maximum Leverage</h3>
                    <p className="text-lg font-semibold">{result.maxLeverage}X</p>
                  </div>
                </div>
                <div className="border-t pt-4 mt-2">
                  <div>
                    <h3 className="font-semibold text-base">Total Margin Required</h3>
                    <p className="text-xl font-bold text-primary">₹{result.totalMargin.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </BaseCalculator>
  );
};

export default MarginCalculator;