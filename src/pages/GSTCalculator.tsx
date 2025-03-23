import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IndianRupee } from 'lucide-react';

type UserType = 'buyer' | 'manufacturer' | 'wholesaler';

interface BuyerResult {
  grossPrice: number;
  cgstAmount: number;
  sgstAmount: number;
  totalTax: number;
}

interface ManufacturerResult {
  productionCost: number;
  profitAmount: number;
  totalTax: number;
  sellingPrice: number;
}

interface WholesalerResult {
  purchasePrice: number;
  profitAmount: number;
  totalTax: number;
  sellingPrice: number;
}

const GSTCalculator = () => {
  const [userType, setUserType] = useState<UserType>('manufacturer');
  
  // Buyer state
  const [netPrice, setNetPrice] = useState<string>('');
  const [buyerResult, setBuyerResult] = useState<BuyerResult>({
    grossPrice: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    totalTax: 0
  });

  // Manufacturer state
  const [productionCost, setProductionCost] = useState<string>('');
  const [profitPercentage, setProfitPercentage] = useState<string>('');
  const [manufacturerResult, setManufacturerResult] = useState<ManufacturerResult>({
    productionCost: 0,
    profitAmount: 0,
    totalTax: 0,
    sellingPrice: 0
  });

  // Wholesaler state
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [wholesalerProfitPercentage, setWholesalerProfitPercentage] = useState<string>('');
  const [wholesalerResult, setWholesalerResult] = useState<WholesalerResult>({
    purchasePrice: 0,
    profitAmount: 0,
    totalTax: 0,
    sellingPrice: 0
  });

  // Common state
  const [gstRate, setGstRate] = useState<string>('5');
  const [customRate, setCustomRate] = useState<string>('');

  const handleBuyerCalculate = () => {
    const price = parseFloat(netPrice) || 0;
    const rate = customRate ? parseFloat(customRate) : parseFloat(gstRate);
    
    const totalTaxAmount = price * (rate / 100);
    const grossPrice = price + totalTaxAmount;
    const halfTax = totalTaxAmount / 2;

    setBuyerResult({
      grossPrice,
      cgstAmount: halfTax,
      sgstAmount: halfTax,
      totalTax: totalTaxAmount
    });
  };

  const handleManufacturerCalculate = () => {
    const cost = parseFloat(productionCost) || 0;
    const profitPercent = parseFloat(profitPercentage) || 0;
    const rate = customRate ? parseFloat(customRate) : parseFloat(gstRate);
    
    const profitAmount = cost * (profitPercent / 100);
    const basePrice = cost + profitAmount;
    const totalTaxAmount = basePrice * (rate / 100);
    const sellingPrice = basePrice + totalTaxAmount;

    setManufacturerResult({
      productionCost: cost,
      profitAmount,
      totalTax: totalTaxAmount,
      sellingPrice
    });
  };

  const handleWholesalerCalculate = () => {
    const price = parseFloat(purchasePrice) || 0;
    const profitPercent = parseFloat(wholesalerProfitPercentage) || 0;
    const rate = customRate ? parseFloat(customRate) : parseFloat(gstRate);
    
    const profitAmount = price * (profitPercent / 100);
    const basePrice = price + profitAmount;
    const totalTaxAmount = basePrice * (rate / 100);
    const sellingPrice = basePrice + totalTaxAmount;

    setWholesalerResult({
      purchasePrice: price,
      profitAmount,
      totalTax: totalTaxAmount,
      sellingPrice
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount).replace('₹', '');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6 max-w-6xl mx-auto animate-on-mount">
          <h1 className="text-3xl font-bold mb-6 text-center text-red-500">GST Calculator India</h1>

          <div className="glass-card p-6 mb-8 bg-gray-50 rounded-lg shadow-sm">
            <Tabs value={userType} onValueChange={(value) => setUserType(value as UserType)}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="buyer">Buyer</TabsTrigger>
                <TabsTrigger value="manufacturer">Manufacturer</TabsTrigger>
                <TabsTrigger value="wholesaler">Wholesaler/Retailer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buyer" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="netPrice" className="text-base">Net Price</Label>
                      <div className="flex mt-1">
                        <div className="flex items-center justify-center h-10 w-10 rounded-l-md border border-r-0 border-input bg-muted">
                          <IndianRupee size={16} />
                        </div>
                        <Input
                          id="netPrice"
                          type="number"
                          value={netPrice}
                          onChange={(e) => setNetPrice(e.target.value)}
                          className="rounded-l-none"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base">GST</Label>
                      <RadioGroup className="flex gap-6 mt-2" value={gstRate} onValueChange={setGstRate}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5" id="r1" />
                          <Label htmlFor="r1">5%</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="12" id="r2" />
                          <Label htmlFor="r2">12%</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="18" id="r3" />
                          <Label htmlFor="r3">18%</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="28" id="r4" />
                          <Label htmlFor="r4">28%</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base">OR</Label>
                      <div className="flex items-center mt-1 gap-2">
                        <Input
                          type="number"
                          value={customRate}
                          onChange={(e) => setCustomRate(e.target.value)}
                          placeholder="0.00"
                          className="w-32"
                        />
                        <span className="text-lg">%</span>
                        <Button onClick={handleBuyerCalculate} className="ml-4">Calculate</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-blue-500 text-white p-4 rounded-lg">
                      <p className="text-center mb-4 font-semibold">Gross Price</p>
                      <div className="border-t border-blue-400 pt-4">
                        <p className="text-center text-xl">₹ {formatCurrency(buyerResult.grossPrice)}</p>
                      </div>
                    </Card>

                    <Card className="bg-red-500 text-white p-4 rounded-lg">
                      <p className="text-center mb-4 font-semibold">CGST Amount</p>
                      <div className="border-t border-red-400 pt-4">
                        <p className="text-center text-xl">₹ {formatCurrency(buyerResult.cgstAmount)}</p>
                      </div>
                    </Card>

                    <Card className="bg-teal-500 text-white p-4 rounded-lg">
                      <p className="text-center mb-4 font-semibold">SGST Amount</p>
                      <div className="border-t border-teal-400 pt-4">
                        <p className="text-center text-xl">₹ {formatCurrency(buyerResult.sgstAmount)}</p>
                      </div>
                    </Card>

                    <Card className="bg-gray-600 text-white p-4 rounded-lg">
                      <p className="text-center mb-4 font-semibold">Total Tax</p>
                      <div className="border-t border-gray-500 pt-4">
                        <p className="text-center text-xl">₹ {formatCurrency(buyerResult.totalTax)}</p>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="manufacturer" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="productionCost" className="text-base">Production Cost</Label>
                      <div className="flex mt-1">
                        <div className="flex items-center justify-center h-10 w-10 rounded-l-md border border-r-0 border-input bg-muted">
                          <IndianRupee size={16} />
                        </div>
                        <Input
                          id="productionCost"
                          type="number"
                          value={productionCost}
                          onChange={(e) => setProductionCost(e.target.value)}
                          className="rounded-l-none"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="profitPercentage" className="text-base">Profit Percentage</Label>
                      <div className="flex mt-1">
                        <Input
                          id="profitPercentage"
                          type="number"
                          value={profitPercentage}
                          onChange={(e) => setProfitPercentage(e.target.value)}
                          className="w-full"
                          placeholder="0.00"
                        />
                        <div className="flex items-center justify-center h-10 w-10 rounded-r-md border border-l-0 border-input bg-muted">
                          <span>%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base">GST</Label>
                      <RadioGroup className="flex gap-6 mt-2" value={gstRate} onValueChange={setGstRate}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5" id="m1" />
                          <Label htmlFor="m1">5%</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="12" id="m2" />
                          <Label htmlFor="m2">12%</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="18" id="m3" />
                          <Label htmlFor="m3">18%</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="28" id="m4" />
                          <Label htmlFor="m4">28%</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base">OR</Label>
                      <div className="flex items-center mt-1 gap-2">
                        <Input
                          type="number"
                          value={customRate}
                          onChange={(e) => setCustomRate(e.target.value)}
                          placeholder="0.00"
                          className="w-32"
                        />
                        <span className="text-lg">%</span>
                        <Button onClick={handleManufacturerCalculate} className="ml-4 bg-blue-600 hover:bg-blue-700">Calculate</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-blue-500 text-white p-4 rounded-lg">
                      <p className="text-center mb-4 font-semibold">Production Cost</p>
                      <div className="border-t border-blue-400 pt-4">
                        <p className="text-center text-xl">₹ {formatCurrency(manufacturerResult.productionCost)}</p>
                      </div>
                    </Card>

                    <Card className="bg-teal-500 text-white p-4 rounded-lg">
                      <p className="text-center mb-4 font-semibold">Profit Amount</p>
                      <div className="border-t border-teal-400 pt-4">
                        <p className="text-center text-xl">₹ {formatCurrency(manufacturerResult.profitAmount)}</p>
                      </div>
                    </Card>

                    <Card className="bg-gray-600 text-white p-4 rounded-lg">
                      <p className="text-center mb-4 font-semibold">Total Tax</p>
                      <div className="border-t border-gray-500 pt-4">
                        <p className="text-center text-xl">₹ {formatCurrency(manufacturerResult.totalTax)}</p>
                      </div>
                    </Card>

                    <Card className="bg-red-500 text-white p-4 rounded-lg">
                      <p className="text-center mb-4 font-semibold">Selling Price</p>
                      <div className="border-t border-red-400 pt-4">
                        <p className="text-center text-xl">₹ {formatCurrency(manufacturerResult.sellingPrice)}</p>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="wholesaler" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="purchasePrice" className="text-base">Purchase Price</Label>
                      <div className="flex mt-1">
                        <div className="flex items-center justify-center h-10 w-10 rounded-l-md border border-r-0 border-input bg-muted">
                          <IndianRupee size={16} />
                        </div>
                        <Input
                          id="purchasePrice"
                          type="number"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(e.target.value)}
                          className="rounded-l-none"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="wholesalerProfitPercentage" className="text-base">Profit Percentage</Label>
                      <div className="flex mt-1">
                        <Input
                          id="wholesalerProfitPercentage"
                          type="number"
                          value={wholesalerProfitPercentage}
                          onChange={(e) => setWholesalerProfitPercentage(e.target.value)}
                          className="w-full"
                          placeholder="0.00"
                        />
                        <div className="flex items-center justify-center h-10 w-10 rounded-r-md border border-l-0 border-input bg-muted">
                          <span>%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base">GST</Label>
                      <RadioGroup className="flex gap-6 mt-2" value={gstRate} onValueChange={setGstRate}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5" id="w1" />
                          <Label htmlFor="w1">5%</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="12" id="w2" />
                          <Label htmlFor="w2">12%</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="18" id="w3" />
                          <Label htmlFor="w3">18%</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="28" id="w4" />
                          <Label htmlFor="w4">28%</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-base">OR</Label>
                      <div className="flex items-center mt-1 gap-2">
                        <Input
                          type="number"
                          value={customRate}
                          onChange={(e) => setCustomRate(e.target.value)}
                          placeholder="0.00"
                          className="w-32"
                        />
                        <span className="text-lg">%</span>
                        <Button onClick={handleWholesalerCalculate} className="ml-4 bg-blue-600 hover:bg-blue-700">Calculate</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-blue-500 text-white p-4 rounded-lg">
                      <p className="text-center mb-4 font-semibold">Purchase Price</p>
                      <div className="border-t border-blue-400 pt-4">
                        <p className="text-center text-xl">₹ {formatCurrency(wholesalerResult.purchasePrice)}</p>
                      </div>
                    </Card>

                    <Card className="bg-teal-500 text-white p-4 rounded-lg">
                      <p className="text-center mb-4 font-semibold">Profit Amount</p>
                      <div className="border-t border-teal-400 pt-4">
                        <p className="text-center text-xl">₹ {formatCurrency(wholesalerResult.profitAmount)}</p>
                      </div>
                    </Card>

                    <Card className="bg-gray-600 text-white p-4 rounded-lg">
                      <p className="text-center mb-4 font-semibold">Total Tax</p>
                      <div className="border-t border-gray-500 pt-4">
                        <p className="text-center text-xl">₹ {formatCurrency(wholesalerResult.totalTax)}</p>
                      </div>
                    </Card>

                    <Card className="bg-red-500 text-white p-4 rounded-lg">
                      <p className="text-center mb-4 font-semibold">Selling Price</p>
                      <div className="border-t border-red-400 pt-4">
                        <p className="text-center text-xl">₹ {formatCurrency(wholesalerResult.sellingPrice)}</p>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex items-center justify-start gap-6 text-muted-foreground">
            <Button variant="ghost" size="sm" className="gap-2">
              <span>Send Feedback</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <span>Share</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GSTCalculator;
