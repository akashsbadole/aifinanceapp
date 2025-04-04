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
import MarginInformation from "./information/MarginInformation";

const MarginCalculator = () => {
  const [positionSize, setPositionSize] = useState<string>("");
  const [marginRequired, setMarginRequired] = useState<string>("");
  const [leverage, setLeverage] = useState<string>("");
  const [marginUsed, setMarginUsed] = useState<string>("");
  const [positionType, setPositionType] = useState<string>("equity");
  const [result, setResult] = useState<{
    marginRequired: number;
    leverage: number;
    marginPercentage: number;
    maintenanceMargin: number;
  } | null>(null);

  const calculateMargin = () => {
    const position = parseFloat(positionSize);
    const margin = parseFloat(marginRequired);
    const leverageVal = position / margin;
    const marginPercentage = (margin / position) * 100;
    const maintenanceMargin = margin * 0.75; // Typical maintenance margin is 75% of initial margin

    setResult({
      marginRequired: margin,
      leverage: leverageVal,
      marginPercentage,
      maintenanceMargin,
    });
  };

  return (
    <BaseCalculator title="Margin Calculator">
      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="positionType">Position Type</Label>
            <Select
              onValueChange={(value) => setPositionType(value)}
              defaultValue={positionType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equity">Equity</SelectItem>
                <SelectItem value="futures">Futures</SelectItem>
                <SelectItem value="options">Options</SelectItem>
                <SelectItem value="currency">Currency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="positionSize">Position Size (₹)</Label>
            <Input
              id="positionSize"
              type="number"
              value={positionSize}
              onChange={(e) => setPositionSize(e.target.value)}
              placeholder="Enter total position value"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="marginRequired">Initial Margin Required (₹)</Label>
            <Input
              id="marginRequired"
              type="number"
              value={marginRequired}
              onChange={(e) => setMarginRequired(e.target.value)}
              placeholder="Enter margin requirement"
            />
            <p className="text-sm text-muted-foreground">
              Typical margin requirements: Equity: 20-100%, F&O: 15-25%,
              Currency: 2-5%
            </p>
          </div>

          <Button onClick={calculateMargin}>Calculate Margin</Button>
        </div>

        {result && (
          <div className="mt-6">
            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <h3 className="font-semibold text-lg">Margin Required</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.marginRequired.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Leverage</h3>
                  <p className="text-2xl font-bold text-primary">
                    {result.leverage.toFixed(2)}x
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Margin %</h3>
                  <p className="text-2xl font-bold text-primary">
                    {result.marginPercentage.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Maintenance Margin</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.maintenanceMargin.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <MarginInformation />
      </div>
    </BaseCalculator>
  );
};

export default MarginCalculator;
