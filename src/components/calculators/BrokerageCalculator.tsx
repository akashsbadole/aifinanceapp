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
import BrokerageInformation from "./information/BrokerageInformation";

const BrokerageCalculator = () => {
  const [orderValue, setOrderValue] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [buyPrice, setBuyPrice] = useState<string>("");
  const [sellPrice, setSellPrice] = useState<string>("");
  const [tradeType, setTradeType] = useState<string>("equity-delivery");
  const [brokerageType, setBrokerageType] = useState<string>("flat");
  const [customBrokerage, setCustomBrokerage] = useState<string>("");
  const [result, setResult] = useState<{
    totalBrokerage: number;
    stt: number;
    exchangeCharges: number;
    gst: number;
    sebiCharges: number;
    stampDuty: number;
    totalCharges: number;
    netProfitLoss: number;
    breakEvenPrice: number;
  } | null>(null);

  const calculateBrokerage = () => {
    const qty = parseFloat(quantity);
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const buyValue = qty * buy;
    const sellValue = qty * sell;
    const totalValue = buyValue + sellValue;

    let brokerage = 0;
    if (brokerageType === "flat") {
      brokerage = 40; // ₹20 per side for flat fee brokers
    } else if (brokerageType === "percentage") {
      const brokerageRate = parseFloat(customBrokerage) / 100;
      brokerage = (buyValue + sellValue) * brokerageRate;
    }

    let stt = 0;
    let exchangeCharges = 0;
    let sebiCharges = 0;
    let stampDuty = 0;

    // Calculate STT based on trade type
    switch (tradeType) {
      case "equity-delivery":
        stt = (buyValue + sellValue) * 0.001; // 0.1% on both sides
        exchangeCharges = totalValue * 0.0000345; // 0.00345% typical
        stampDuty = buyValue * 0.00015; // 0.015% on buy side
        break;
      case "equity-intraday":
        stt = sellValue * 0.00025; // 0.025% on sell side
        exchangeCharges = totalValue * 0.0000345;
        stampDuty = buyValue * 0.00003; // 0.003% for intraday
        break;
      case "futures":
        stt = sellValue * 0.000125; // 0.0125% on sell side
        exchangeCharges = totalValue * 0.0000345;
        stampDuty = buyValue * 0.00002; // 0.002% for F&O
        break;
      case "options":
        stt = sellValue * 0.000625; // 0.0625% on premium
        exchangeCharges = totalValue * 0.0000345;
        stampDuty = buyValue * 0.00002;
        break;
    }

    // SEBI charges
    sebiCharges = totalValue * 0.0000001; // ₹10 per crore = 0.00001%

    // GST on brokerage and exchange charges
    const gst = (brokerage + exchangeCharges) * 0.18;

    // Total charges
    const totalCharges =
      brokerage + stt + exchangeCharges + gst + sebiCharges + stampDuty;

    // Net P&L
    const grossPL = sellValue - buyValue;
    const netPL = grossPL - totalCharges;

    // Break-even price calculation
    const breakEvenPercent = (totalCharges / buyValue) * 100;
    const breakEvenPrice = buy * (1 + breakEvenPercent / 100);

    setResult({
      totalBrokerage: brokerage,
      stt,
      exchangeCharges,
      gst,
      sebiCharges,
      stampDuty,
      totalCharges,
      netProfitLoss: netPL,
      breakEvenPrice,
    });
  };

  return (
    <BaseCalculator title="Brokerage Calculator">
      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="tradeType">Trade Type</Label>
            <Select
              onValueChange={(value) => setTradeType(value)}
              defaultValue={tradeType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trade type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equity-delivery">Equity Delivery</SelectItem>
                <SelectItem value="equity-intraday">Equity Intraday</SelectItem>
                <SelectItem value="futures">Futures</SelectItem>
                <SelectItem value="options">Options</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="brokerageType">Brokerage Structure</Label>
            <Select
              onValueChange={(value) => setBrokerageType(value)}
              defaultValue={brokerageType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brokerage type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat Fee (₹20 per order)</SelectItem>
                <SelectItem value="percentage">Percentage Based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {brokerageType === "percentage" && (
            <div className="grid gap-2">
              <Label htmlFor="customBrokerage">Brokerage Percentage (%)</Label>
              <Input
                id="customBrokerage"
                type="number"
                value={customBrokerage}
                onChange={(e) => setCustomBrokerage(e.target.value)}
                placeholder="Enter brokerage percentage"
                step="0.01"
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="buyPrice">Buy Price (₹)</Label>
            <Input
              id="buyPrice"
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="Enter buy price"
              step="0.05"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sellPrice">Sell Price (₹)</Label>
            <Input
              id="sellPrice"
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              placeholder="Enter sell price"
              step="0.05"
            />
          </div>

          <Button onClick={calculateBrokerage}>Calculate Charges</Button>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Brokerage</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.totalBrokerage.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">STT</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.stt.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Exchange Charges</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.exchangeCharges.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">GST</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.gst.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">SEBI Charges</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.sebiCharges.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Stamp Duty</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.stampDuty.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Total Charges</h3>
                  <p className="text-2xl font-bold text-primary">
                    ₹{result.totalCharges.toFixed(2)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Net P&L</h3>
                  <p
                    className={`text-2xl font-bold ${
                      result.netProfitLoss >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ₹{result.netProfitLoss.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  Break-even Analysis
                </h3>
                <p className="text-primary">
                  To break even, the stock needs to reach{" "}
                  <span className="font-bold">
                    ₹{result.breakEvenPrice.toFixed(2)}
                  </span>
                </p>
              </div>
            </Card>
          </div>
        )}

        <BrokerageInformation />
      </div>
    </BaseCalculator>
  );
};

export default BrokerageCalculator;
