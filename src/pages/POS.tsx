import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Plus, Minus, Trash2, Printer, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useReactToPrint } from "react-to-print";

interface Product {
  id: string;
  name: string;
  sellingPrice: number;
  stockQuantity: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface BillModifications {
  itemDiscounts: { [key: string]: number };
  billDiscount: number;
  additionalCharges: number;
  remarks: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderType: "dine-in" | "takeaway" | "delivery";
}

const Receipt = React.forwardRef<
  HTMLDivElement,
  {
    cart: CartItem[];
    modifications: BillModifications;
    calculations: {
      subtotal: number;
      itemDiscountTotal: number;
      finalTotal: number;
    };
  }
>(({ cart, modifications, calculations }, ref) => {
  return (
    <div ref={ref} className="p-6 bg-white w-[300px] hidden print:block">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">RESTAURANT NAME</h1>
        <p className="text-sm">123 Business Street, City</p>
        <p className="text-sm">Tel: (123) 456-7890</p>
        <p className="text-sm">GST No: XXXXXXXXXXXXX</p>
      </div>

      <div className="text-sm mb-4">
        <p>Bill No: {new Date().getTime()}</p>
        <p>Date: {new Date().toLocaleDateString()}</p>
        <p>Time: {new Date().toLocaleTimeString()}</p>
        <p>Order Type: {modifications.orderType}</p>
      </div>

      {modifications.customerName && (
        <div className="text-sm mb-4 border-t border-b py-2">
          <p>Customer: {modifications.customerName}</p>
          {modifications.customerPhone && (
            <p>Phone: {modifications.customerPhone}</p>
          )}
          {modifications.customerAddress && (
            <p>Address: {modifications.customerAddress}</p>
          )}
        </div>
      )}

      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="border-b">
            <th className="text-left">Item</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Price</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => {
            const discount = modifications.itemDiscounts[item.id] || 0;
            const itemTotal = item.sellingPrice * item.quantity;
            const discountAmount = (itemTotal * discount) / 100;
            const finalAmount = itemTotal - discountAmount;

            return (
              <tr key={item.id} className="border-b">
                <td className="text-left">{item.name}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">${item.sellingPrice.toFixed(2)}</td>
                <td className="text-right">${finalAmount.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${calculations.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Item Discounts:</span>
          <span>-${calculations.itemDiscountTotal.toFixed(2)}</span>
        </div>
        {modifications.billDiscount > 0 && (
          <div className="flex justify-between">
            <span>Bill Discount:</span>
            <span>-${modifications.billDiscount.toFixed(2)}</span>
          </div>
        )}
        {modifications.additionalCharges > 0 && (
          <div className="flex justify-between">
            <span>Additional Charges:</span>
            <span>${modifications.additionalCharges.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold border-t pt-2 mt-2">
          <span>Final Total:</span>
          <span>${calculations.finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {modifications.remarks && (
        <div className="mt-4 text-sm">
          <p className="font-bold">Remarks:</p>
          <p>{modifications.remarks}</p>
        </div>
      )}

      <div className="text-center mt-6 text-sm">
        <p>Thank you for your business!</p>
        <p>Visit again</p>
      </div>
    </div>
  );
});

const calculateBillTotals = (
  cart: CartItem[],
  modifications: BillModifications
) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );

  const itemDiscountTotal = cart.reduce((sum, item) => {
    const itemTotal = item.sellingPrice * item.quantity;
    const discount = modifications.itemDiscounts[item.id] || 0;
    return sum + (itemTotal * discount) / 100;
  }, 0);

  const finalTotal =
    subtotal -
    itemDiscountTotal -
    modifications.billDiscount +
    modifications.additionalCharges;

  return { subtotal, itemDiscountTotal, finalTotal };
};

const POS = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [modifications, setModifications] = useState<BillModifications>({
    itemDiscounts: {},
    billDiscount: 0,
    additionalCharges: 0,
    remarks: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    orderType: "dine-in",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/inventory/products"
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    }
  };

  const addToCart = (product: Product) => {
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const calculations = calculateBillTotals(cart, modifications);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const saleResponse = await fetch("http://localhost:3001/pos/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: modifications.customerName || "Walk-in Customer",
          totalAmount: calculations.finalTotal,
          paymentMethod: modifications.orderType,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.sellingPrice,
            total: item.sellingPrice * item.quantity,
          })),
        }),
      });
      if (!saleResponse.ok) {
        throw new Error("Sale creation failed");
      }
      const saleData = await saleResponse.json();

      const paymentResponse = await fetch("http://localhost:3001/pos/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saleId: saleData.id,
          amount: calculations.finalTotal,
          method: modifications.orderType,
        }),
      });
      if (!paymentResponse.ok) {
        throw new Error("Payment processing failed");
      }

      toast({
        title: "Success",
        description: "Sale successful!",
      });
      setCart([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Checkout failed!",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    removeAfterPrint: true,
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Section - Categories and Products */}
      <div className="flex-1 flex flex-col p-4">
        {/* Search and Categories Bar */}
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <div className="flex gap-2">
            <Button variant="outline">All</Button>
            <Button variant="outline">Food</Button>
            <Button variant="outline">Beverages</Button>
            <Button variant="outline">Snacks</Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-6 gap-4 overflow-auto pb-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-green-600">
                  ${product.sellingPrice.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  Stock: {product.stockQuantity}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Section - Cart and Payment */}
      <div className="w-[400px] bg-white border-l flex flex-col">
        {/* Customer Details */}
        <div className="p-4 border-b space-y-2">
          <h2 className="font-bold">Customer Details</h2>
          <Input
            placeholder="Customer Name"
            value={modifications.customerName}
            onChange={(e) =>
              setModifications({
                ...modifications,
                customerName: e.target.value,
              })
            }
          />
          <Input
            placeholder="Phone"
            value={modifications.customerPhone}
            onChange={(e) =>
              setModifications({
                ...modifications,
                customerPhone: e.target.value,
              })
            }
          />
          <Input
            placeholder="Address"
            value={modifications.customerAddress}
            onChange={(e) =>
              setModifications({
                ...modifications,
                customerAddress: e.target.value,
              })
            }
          />
          <select
            value={modifications.orderType}
            onChange={(e) =>
              setModifications({
                ...modifications,
                orderType: e.target.value as BillModifications["orderType"],
              })
            }
            className="w-full p-2 border rounded"
          >
            <option value="dine-in">Dine In</option>
            <option value="takeaway">Take Away</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>

        {/* Cart Items with Discounts */}
        <div className="flex-1 overflow-auto p-4">
          {cart.map((item) => (
            <div key={item.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    ${item.sellingPrice.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">Disc %</span>
                  <Input
                    type="number"
                    value={modifications.itemDiscounts[item.id] || 0}
                    onChange={(e) =>
                      setModifications({
                        ...modifications,
                        itemDiscounts: {
                          ...modifications.itemDiscounts,
                          [item.id]: Number(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-16 h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bill Modifications */}
        <div className="border-t p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span>Bill Discount</span>
            <Input
              type="number"
              value={modifications.billDiscount}
              onChange={(e) =>
                setModifications({
                  ...modifications,
                  billDiscount: Number(e.target.value),
                })
              }
              className="w-32"
            />
          </div>
          <div className="flex justify-between items-center">
            <span>Additional Charges</span>
            <Input
              type="number"
              value={modifications.additionalCharges}
              onChange={(e) =>
                setModifications({
                  ...modifications,
                  additionalCharges: Number(e.target.value),
                })
              }
              className="w-32"
            />
          </div>
          <Input
            placeholder="Remarks"
            value={modifications.remarks}
            onChange={(e) =>
              setModifications({
                ...modifications,
                remarks: e.target.value,
              })
            }
          />

          <div className="pt-3 border-t">
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>${calculations.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Item Discounts:</span>
              <span>-${calculations.itemDiscountTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Final Total:</span>
              <span>${calculations.finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="outline" onClick={() => setCart([])}>
              Clear All
            </Button>
            <Button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700"
            >
              Save & Print
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden Receipt */}
      <div className="hidden">
        <Receipt
          ref={receiptRef}
          cart={cart}
          modifications={modifications}
          calculations={calculations}
        />
      </div>
    </div>
  );
};

export default POS;
