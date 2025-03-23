import React, { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Plus, Trash2, Download } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  unit: string;
}

interface InvoiceData {
  companyName: string;
  companyAddress: string;
  gstin: string;
  customerName: string;
  customerAddress: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  includeTax: boolean;
  notes: string;
  terms: string;
  logo?: string;
  currency: string;
  total: number;
}

const InvoiceGenerator = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyName: '',
    companyAddress: '',
    gstin: '',
    customerName: '',
    customerAddress: '',
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [
      { id: 1, description: '', quantity: 0, rate: 0, amount: 0, unit: 'PCS' }
    ],
    includeTax: false,
    notes: '',
    terms: 'Thanks for doing business with us!',
    currency: 'India (₹)',
    total: 0,
    logo: ''
  });

  const UNITS = [
    { value: 'GM', label: 'GRAMMES (GM)' },
    { value: 'KG', label: 'KILOGRAMS (KG)' },
    { value: 'LTR', label: 'LITRE (LTR)' },
    { value: 'ML', label: 'MILILITRE (ML)' },
    { value: 'NOS', label: 'NUMBERS (NOS)' },
    { value: 'PAC', label: 'PACKS (PAC)' },
    { value: 'PCS', label: 'PIECES (PCS)' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate);
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: prev.items.length + 1,
        description: '',
        quantity: 0,
        rate: 0,
        amount: 0,
        unit: 'PCS'
      }]
    }));
  };

  const removeItem = (id: number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const calculateTotal = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = invoiceData.includeTax ? subtotal * 0.18 : 0;
    return (subtotal + tax).toFixed(2);
  };

  const generatePDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${invoiceData.invoiceNo || 'new'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Maximum dimensions while maintaining aspect ratio
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Adjust quality based on file size
          let quality = 0.7;
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (500KB = 512000 bytes)
    const MAX_FILE_SIZE = 512000;
    
    try {
      if (file.size <= MAX_FILE_SIZE) {
        // If file is under 500KB, process normally
        const reader = new FileReader();
        reader.onloadend = () => {
          setInvoiceData(prev => ({
            ...prev,
            logo: reader.result as string
          }));
        };
        reader.readAsDataURL(file);
      } else {
        // If file is larger than 500KB, compress it
        const compressedImage = await compressImage(file);
        setInvoiceData(prev => ({
          ...prev,
          logo: compressedImage
        }));
        toast({
          title: "Image compressed",
          description: "The logo was compressed to optimize file size.",
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error processing logo:', error);
      toast({
        title: "Error",
        description: "Failed to process the logo. Please try a different image.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6 max-w-6xl mx-auto animate-on-mount">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Invoice Generator</h1>
            <Button onClick={generatePDF} className="rounded-full">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="glass-effect grid grid-cols-2 w-[300px] mb-6">
              <TabsTrigger value="details">Enter Details</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card className="p-6 glass-card">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Company Logo</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="cursor-pointer"
                      />
                      {invoiceData.logo && (
                        <div className="mt-2">
                          <img 
                            src={invoiceData.logo} 
                            alt="Company Logo" 
                            className="h-16 object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        name="companyName"
                        value={invoiceData.companyName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>Company Address</Label>
                      <Textarea
                        name="companyAddress"
                        value={invoiceData.companyAddress}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>GSTIN</Label>
                      <Input
                        name="gstin"
                        value={invoiceData.gstin}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Invoice No</Label>
                      <Input
                        name="invoiceNo"
                        value={invoiceData.invoiceNo}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        name="date"
                        value={invoiceData.date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        name="dueDate"
                        value={invoiceData.dueDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">Bill To</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Customer Name</Label>
                      <Input
                        name="customerName"
                        value={invoiceData.customerName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>Customer Address</Label>
                      <Textarea
                        name="customerAddress"
                        value={invoiceData.customerAddress}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Items</h2>
                    <Button onClick={addItem} variant="outline" size="sm" className='bg-black text-white'>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Item</th>
                          <th className="text-left p-2">Quantity</th>
                          <th className="text-left p-2">Unit</th>
                          <th className="text-left p-2">Rate</th>
                          <th className="text-left p-2">Amount</th>
                          <th className="text-left p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.items.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="p-2">
                              <Input
                                value={item.description}
                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                              />
                            </td>
                            <td className="p-2">
                              <select
                                className="w-full p-2 border rounded-md"
                                value={item.unit}
                                onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                              >
                                {UNITS.map(unit => (
                                  <option key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                value={item.rate}
                                onChange={(e) => handleItemChange(item.id, 'rate', Number(e.target.value))}
                              />
                            </td>
                            <td className="p-2">
                              {item.amount.toFixed(2)}
                            </td>
                            <td className="p-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Switch
                      checked={invoiceData.includeTax}
                      onCheckedChange={(checked) => 
                        setInvoiceData(prev => ({ ...prev, includeTax: checked }))
                      }
                    />
                    <Label>Include GST (18%)</Label>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        name="notes"
                        value={invoiceData.notes}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>Terms & Conditions</Label>
                      <Textarea
                        name="terms"
                        value={invoiceData.terms}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card className="p-6 glass-card">
                <div className="flex justify-end mb-4">
                  <Button onClick={generatePDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                
                <div ref={invoiceRef} className="bg-white p-8 relative">
                  {/* Watermark Container */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Repeated watermarks for better coverage */}
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <div className="text-[#e5e7eb] text-8xl font-bold opacity-30 transform rotate-[-35deg] select-none whitespace-nowrap" style={{ letterSpacing: '0.2em' }}>
                        aifinanceapp
                      </div>
                    </div>
                    <div className="absolute top-1/3 left-0 w-full h-full flex items-center justify-center">
                      <div className="text-[#e5e7eb] text-8xl font-bold opacity-30 transform rotate-[-35deg] select-none whitespace-nowrap" style={{ letterSpacing: '0.2em' }}>
                        aifinanceapp
                      </div>
                    </div>
                    <div className="absolute top-2/3 left-0 w-full h-full flex items-center justify-center">
                      <div className="text-[#e5e7eb] text-8xl font-bold opacity-30 transform rotate-[-35deg] select-none whitespace-nowrap" style={{ letterSpacing: '0.2em' }}>
                        aifinanceapp
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      {invoiceData.logo && (
                        <img 
                          src={invoiceData.logo} 
                          alt="Company Logo" 
                          className="h-20 object-contain mb-4"
                        />
                      )}
                      <h2 className="text-2xl font-bold">{invoiceData.companyName}</h2>
                      <p className="text-gray-600 whitespace-pre-line">{invoiceData.companyAddress}</p>
                      <p className="text-gray-600">GSTIN: {invoiceData.gstin}</p>
                    </div>
                    <div className="text-right">
                      <h1 className="text-3xl font-bold mb-4">INVOICE</h1>
                      <p>Invoice No: {invoiceData.invoiceNo}</p>
                      <p>Date: {invoiceData.date}</p>
                      <p>Due Date: {invoiceData.dueDate}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
                    <p className="font-bold">{invoiceData.customerName}</p>
                    <p className="whitespace-pre-line">{invoiceData.customerAddress}</p>
                  </div>

                  <table className="w-full mb-8">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left p-2">Item</th>
                        <th className="text-right p-2">Quantity</th>
                        <th className="text-left p-2">Unit</th>
                        <th className="text-right p-2">Rate</th>
                        <th className="text-right p-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-2">{item.description}</td>
                          <td className="text-right p-2">{item.quantity}</td>
                          <td className="text-left p-2">{item.unit}</td>
                          <td className="text-right p-2">{item.rate.toFixed(2)}</td>
                          <td className="text-right p-2">{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t">
                        <td colSpan={4} className="text-right p-2 font-bold">
                          {invoiceData.includeTax ? 'Subtotal:' : 'Total:'}
                        </td>
                        <td className="text-right p-2">
                          {invoiceData.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                        </td>
                      </tr>
                      {invoiceData.includeTax && (
                        <>
                          <tr>
                            <td colSpan={4} className="text-right p-2">GST (18%):</td>
                            <td className="text-right p-2">
                              {(invoiceData.items.reduce((sum, item) => sum + item.amount, 0) * 0.18).toFixed(2)}
                            </td>
                          </tr>
                          <tr className="border-t">
                            <td colSpan={4} className="text-right p-2 font-bold">Total:</td>
                            <td className="text-right p-2 font-bold">{calculateTotal()}</td>
                          </tr>
                        </>
                      )}
                    </tfoot>
                  </table>

                  {invoiceData.notes && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Notes:</h3>
                      <p className="whitespace-pre-line">{invoiceData.notes}</p>
                    </div>
                  )}

                  {invoiceData.terms && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Terms & Conditions:</h3>
                      <p className="whitespace-pre-line">{invoiceData.terms}</p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default InvoiceGenerator; 