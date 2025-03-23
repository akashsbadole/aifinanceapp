import React, { useState, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Upload, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ProformaInvoice: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [includeGST, setIncludeGST] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const proformaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      amount: field === 'qty' || field === 'rate' 
        ? (newItems[index].qty || 0) * (newItems[index].rate || 0)
        : newItems[index].amount
    };
    setItems(newItems);
  };

  const handleAddRow = () => {
    setItems([...items, {
      key: items.length,
      item: '',
      qty: 0,
      unit: 'PCS',
      rate: 0,
      amount: 0
    }]);
  };

  const handleDeleteRow = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  };

  const calculateGST = () => {
    return includeGST ? calculateSubtotal() * 0.18 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = async () => {
    if (!proformaRef.current) return;

    try {
      const canvas = await html2canvas(proformaRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('proforma-invoice.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto animate-on-mount">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Proforma Invoice</h1>
            <Button onClick={generatePDF} className="rounded-full">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

          <Card className="p-6">
            <div ref={proformaRef} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <Label>Your Company Name</Label>
                    <Input placeholder="Enter company name" />
                  </div>
                  <div>
                    <Label>Company Address</Label>
                    <Textarea placeholder="Enter company address" />
                  </div>
                  <div>
                    <Label>Company GSTIN</Label>
                    <Input placeholder="Enter GSTIN" />
                  </div>
                </div>
                
                <div className="text-right space-y-4">
                  <div>
                    <Label>Company Logo</Label>
                    <div className="flex justify-end">
                      <div 
                        className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {logoUrl ? (
                          <img src={logoUrl} alt="logo" className="w-full h-full object-contain" />
                        ) : (
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2" />
                            <span className="text-sm">Upload Logo</span>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Proforma Invoice #</Label>
                    <Input placeholder="Enter invoice number" />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input type="date" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Customer Details</h2>
                <div>
                  <Label>Customer's Name</Label>
                  <Input placeholder="Enter customer name" />
                </div>
                <div>
                  <Label>Customer Address</Label>
                  <Textarea placeholder="Enter customer address" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Items</h2>
                  <Button onClick={handleAddRow} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.key}>
                        <TableCell>
                          <Input
                            value={item.item}
                            onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                            placeholder="Item name"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            value={item.qty}
                            onChange={(e) => handleItemChange(index, 'qty', parseFloat(e.target.value))}
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.unit}
                            onValueChange={(value) => handleItemChange(index, 'unit', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PCS">Pieces (PCS)</SelectItem>
                              <SelectItem value="KG">Kilograms (KG)</SelectItem>
                              <SelectItem value="GM">Grams (GM)</SelectItem>
                              <SelectItem value="LTR">Liters (LTR)</SelectItem>
                              <SelectItem value="ML">Milliliters (ML)</SelectItem>
                              <SelectItem value="BOX">Box</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value))}
                            placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            disabled
                            value={(item.qty * item.rate).toFixed(2)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRow(index)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end mt-4">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹ {calculateSubtotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={includeGST}
                        onCheckedChange={setIncludeGST}
                      />
                      <Label>Include GST (18%)</Label>
                    </div>
                    
                    {includeGST && (
                      <div className="flex justify-between">
                        <span>GST (18%):</span>
                        <span>₹ {calculateGST().toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span>₹ {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Label>Notes</Label>
                  <Textarea rows={4} placeholder="Enter notes" />
                </div>
                
                <div>
                  <Label>Terms & Conditions</Label>
                  <Textarea 
                    rows={4} 
                    placeholder="Enter terms and conditions"
                    defaultValue="Thanks for doing business with us!"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProformaInvoice;

