import React, { useState, useRef } from 'react';
// import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, FileText, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface FormData {
  companyName: string;
  companyAddress: string;
  companyGSTIN: string;
  customerName: string;
  customerAddress: string;
  receiptNo: string;
  date: string;
  dueDate: string;
  amount: string;
  notes: string;
  terms: string;
}

const CashReceipt: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('form');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    companyAddress: '',
    companyGSTIN: '',
    customerName: '',
    customerAddress: '',
    receiptNo: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    amount: '0.00',
    notes: '',
    terms: 'Thanks for doing business with us!'
  });
  const receiptRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
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
      const margin = 10;

      const imgWidth = pageWidth - (2 * margin);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If content height is greater than page height, split into multiple pages
      if (imgHeight > pageHeight - (2 * margin)) {
        let heightLeft = imgHeight;
        let position = margin;
        let page = 1;

        // Add first page
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - (2 * margin));
        
        // Add subsequent pages if needed
        while (heightLeft > 0) {
          position = margin;
          pdf.addPage();
          pdf.addImage(
            imgData, 
            'PNG', 
            margin, 
            position - (pageHeight - (2 * margin)) * page,
            imgWidth,
            imgHeight
          );
          heightLeft -= (pageHeight - (2 * margin));
          page++;
        }
      } else {
        // If content fits in one page
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      }

      pdf.save('cash-receipt.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <Sidebar />
      
      <main className="ml-2 pt-2 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto animate-on-mount">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Cash Receipt</h1>
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
                        <Label>Receipt Number</Label>
                        <Input 
                          placeholder="Enter receipt number"
                          value={formData.receiptNo}
                          onChange={(e) => handleFormChange('receiptNo', e.target.value)}
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
                    <h2 className="text-lg font-semibold">Receipt To:</h2>
                    <div>
                      <Label>Customer Name</Label>
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
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => handleFormChange('amount', e.target.value)}
                      className="text-right"
                    />
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
                <div ref={receiptRef} className="max-w-4xl mx-auto">
                  {/* Preview Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-1/2">
                      <h2 className="text-2xl font-bold">{formData.companyName || 'Company Name'}</h2>
                      <p className="text-gray-600 whitespace-pre-line">{formData.companyAddress || 'Company Address'}</p>
                      <p className="text-gray-600">GSTIN: {formData.companyGSTIN || 'GSTIN'}</p>
                    </div>
                    <div className="w-1/2 flex flex-col items-end">
                      {logoUrl && (
                        <div className="mb-4">
                          <img src={logoUrl} alt="Company Logo" className="w-32 h-32 object-contain" />
                        </div>
                      )}
                      <div>
                        <h1 className="text-2xl font-bold mb-2">CASH RECEIPT</h1>
                        <p>Receipt No: {formData.receiptNo || '-'}</p>
                        <p>Date: {formData.date || '-'}</p>
                        <p>Due Date: {formData.dueDate || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Receipt To:</h3>
                    <p className="font-bold">{formData.customerName || 'Customer Name'}</p>
                    <p className="whitespace-pre-line">{formData.customerAddress || 'Customer Address'}</p>
                  </div>

                  {/* Amount */}
                  <div className="flex justify-end mb-8">
                    <div className="w-64">
                      <div className="flex justify-between py-2 border-t font-bold">
                        <span>Total Amount:</span>
                        <span>₹ {parseFloat(formData.amount).toFixed(2)}</span>
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

export default CashReceipt; 