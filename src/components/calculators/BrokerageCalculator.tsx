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

const BrokerageCalculator = () => {
  const [tradeValue, setTradeValue] = useState<string>("");
  const [tradeType, setTradeType] = useState<"delivery" | "intraday">(
    "delivery"
  );
  const [result, setResult] = useState<{
    brokerage: number;
    stt: number;
    exchangeCharges: number;
    gst: number;
    sebiCharges: number;
    stampDuty: number;
    totalCharges: number;
    netAmount: number;
  } | null>(null);

  const calculateBrokerage = () => {
    const value = parseFloat(tradeValue);

    // Standard rates for Indian markets
    const brokerageRate = tradeType === "delivery" ? 0.0003 : 0.0002; // 0.03% for delivery, 0.02% for intraday
    const sttRate = tradeType === "delivery" ? 0.001 : 0.00025; // 0.1% for delivery, 0.025% for intraday
    const exchangeRate = 0.0000325; // 0.00325%
    const gstRate = 0.18; // 18%
    const sebiRate = 0.000001; // 0.0001%
    const stampDutyRate = tradeType === "delivery" ? 0.00015 : 0.00003; // 0.015% for delivery, 0.003% for intraday

    const brokerage = value * brokerageRate;
    const stt = value * sttRate;
    const exchangeCharges = value * exchangeRate;
    const sebiCharges = value * sebiRate;
    const stampDuty = value * stampDutyRate;

    // GST is applied on brokerage and exchange charges
    const gst = (brokerage + exchangeCharges) * gstRate;

    const totalCharges =
      brokerage + stt + exchangeCharges + gst + sebiCharges + stampDuty;
    const netAmount =
      tradeType === "delivery" ? value + totalCharges : totalCharges;

    setResult({
      brokerage,
      stt,
      exchangeCharges,
      gst,
      sebiCharges,
      stampDuty,
      totalCharges,
      netAmount,
    });
  };

  return (
    <BaseCalculator title="Brokerage Calculator">
      <div className="grid gap-4">
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
          <Label htmlFor="tradeType">Trade Type</Label>
          <Select
            value={tradeType}
            onValueChange={(value: "delivery" | "intraday") =>
              setTradeType(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select trade type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="intraday">Intraday</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={calculateBrokerage}>Calculate Charges</Button>

        {result && (
          <div className="mt-6">
            <Card>
              <div className="p-6 grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Brokerage
                    </h3>
                    <p className="text-lg font-semibold">
                      ₹{result.brokerage.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      STT
                    </h3>
                    <p className="text-lg font-semibold">
                      ₹{result.stt.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Exchange Charges
                    </h3>
                    <p className="text-lg font-semibold">
                      ₹{result.exchangeCharges.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      GST
                    </h3>
                    <p className="text-lg font-semibold">
                      ₹{result.gst.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      SEBI Charges
                    </h3>
                    <p className="text-lg font-semibold">
                      ₹{result.sebiCharges.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      Stamp Duty
                    </h3>
                    <p className="text-lg font-semibold">
                      ₹{result.stampDuty.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-base">Total Charges</h3>
                      <p className="text-xl font-bold text-primary">
                        ₹{result.totalCharges.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">Net Amount</h3>
                      <p className="text-xl font-bold text-primary">
                        ₹{result.netAmount.toFixed(2)}
                      </p>
                    </div>
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

export default BrokerageCalculator;
