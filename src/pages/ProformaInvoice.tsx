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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Upload, Download, FileText, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface FormData {
  companyName: string;
  companyAddress: string;
  companyGSTIN: string;
  customerName: string;
  customerAddress: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  notes: string;
  terms: string;
}

const ProformaInvoice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('form');
  const [items, setItems] = useState<any[]>([]);
  const [includeGST, setIncludeGST] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    companyAddress: '',
    companyGSTIN: '',
    customerName: '',
    customerAddress: '',
    invoiceNumber: '',
    date: '',
    dueDate: '',
    notes: '',
    terms: 'Thanks for doing business with us!'
  });
  const proformaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
      const canvas = await html2canvas(proformaRef.current, {
        scale: 2, // Increase resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // 10mm margins

      const imgWidth = pageWidth - (2 * margin);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      pdf.save('proforma-invoice.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-2 pt-2 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto animate-on-mount">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Proforma Invoice</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab(activeTab === 'form' ? 'preview' : 'form')}
                className="rounded-full"
              >
                {activeTab === 'form' ? (
                  <><Eye className="w-4 h-4 mr-2" /> Preview</>
                ) : (
                  <><FileText className="w-4 h-4 mr-2" /> Edit</>
                )}
              </Button>
              <Button onClick={generatePDF} className="rounded-full">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="form">
              <Card className="p-6">
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <Label>Your Company Name</Label>
                        <Input 
                          placeholder="Enter company name"
                          value={formData.companyName}
                          onChange={(e) => handleFormChange('companyName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Company Address</Label>
                        <Textarea 
                          placeholder="Enter company address"
                          value={formData.companyAddress}
                          onChange={(e) => handleFormChange('companyAddress', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Company GSTIN</Label>
                        <Input 
                          placeholder="Enter GSTIN"
                          value={formData.companyGSTIN}
                          onChange={(e) => handleFormChange('companyGSTIN', e.target.value)}
                        />
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
                        <Input 
                          placeholder="Enter invoice number"
                          value={formData.invoiceNumber}
                          onChange={(e) => handleFormChange('invoiceNumber', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input 
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleFormChange('date', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <Input 
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => handleFormChange('dueDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Customer Details</h2>
                    <div>
                      <Label>Customer's Name</Label>
                      <Input 
                        placeholder="Enter customer name"
                        value={formData.customerName}
                        onChange={(e) => handleFormChange('customerName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Customer Address</Label>
                      <Textarea 
                        placeholder="Enter customer address"
                        value={formData.customerAddress}
                        onChange={(e) => handleFormChange('customerAddress', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Items</h2>
                      <Button onClick={handleAddRow} variant="outline" size="sm" className="bg-blue-500 text-white">
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
                      <Textarea 
                        rows={4} 
                        placeholder="Enter notes"
                        value={formData.notes}
                        onChange={(e) => handleFormChange('notes', e.target.value)}
                      />
                    </div>
                    
                <div>
                      <Label>Terms & Conditions</Label>
                      <Textarea 
                        rows={4} 
                        placeholder="Enter terms and conditions"
                        value={formData.terms}
                        onChange={(e) => handleFormChange('terms', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card className="p-8 bg-white">
                <div ref={proformaRef} className="max-w-4xl mx-auto">
                  {/* Preview Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-1/2">
                      <h2 className="text-2xl font-bold">{formData.companyName || 'Company Name'}</h2>
                      <p className="text-gray-600 whitespace-pre-line">{formData.companyAddress || 'Company Address'}</p>
                      <p className="text-gray-600">GSTIN: {formData.companyGSTIN || 'GSTIN'}</p>
                    </div>
                    <div className="w-1/2 flex flex-col items-left">
                      {logoUrl && (
                        <div className="mb-4">
                          <img src={logoUrl} alt="Company Logo" className="w-32 h-32 object-contain" />
                        </div>
                      )}
                      <div>
                        <h1 className="text-2xl font-bold mb-2">PROFORMA INVOICE</h1>
                        <p>Invoice No: {formData.invoiceNumber || '-'}</p>
                        <p>Date: {formData.date || '-'}</p>
                        <p>Due Date: {formData.dueDate || '-'}</p>
                      </div>
          </div>
        </div>

                  {/* Customer Details */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
                    <p className="font-bold">{formData.customerName || 'Customer Name'}</p>
                    <p className="whitespace-pre-line">{formData.customerAddress || 'Customer Address'}</p>
                  </div>

                  {/* Items Table */}
                  <Table className="mb-8">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.key}>
                          <TableCell>{item.item}</TableCell>
                          <TableCell className="text-right">{item.qty}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell className="text-right">₹ {item.rate.toFixed(2)}</TableCell>
                          <TableCell className="text-right">₹ {(item.qty * item.rate).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Totals */}
                  <div className="flex justify-end mb-8">
                    <div className="w-64">
                      <div className="flex justify-between py-2">
                        <span>Subtotal:</span>
                        <span>₹ {calculateSubtotal().toFixed(2)}</span>
                      </div>
                      {includeGST && (
                        <div className="flex justify-between py-2">
                          <span>GST (18%):</span>
                          <span>₹ {calculateGST().toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-t font-bold">
                        <span>Total:</span>
                        <span>₹ {calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes and Terms */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-2">Notes:</h3>
                      <p className="text-gray-600 whitespace-pre-line">{formData.notes}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Terms & Conditions:</h3>
                      <p className="text-gray-600 whitespace-pre-line">{formData.terms}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ProformaInvoice;


