import React, { useState } from 'react';
import Barcode from 'react-barcode';
// import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface FormData {
  itemName: string;
  itemCode: string;
  width: number;
  height: number;
  format: string;
}

const BarcodeGenerator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    itemName: '',
    itemCode: '1234567890',
    width: 2,
    height: 100,
    format: 'CODE128'
  });

  const handleDownload = async (format: 'png' | 'jpg' | 'pdf') => {
    const barcodeElement = document.getElementById('barcode-element');
    if (!barcodeElement) return;

    if (format === 'pdf') {
      const canvas = await html2canvas(barcodeElement, {
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 150;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const x = (pageWidth - imgWidth) / 2;
      
      pdf.addImage(imgData, 'PNG', x, 20, imgWidth, imgWidth / 2);
      
      // Add item details
      pdf.setFontSize(12);
      pdf.text(`Item Name: ${formData.itemName}`, 20, 120);
      pdf.text(`Item Code: ${formData.itemCode}`, 20, 130);
      
      pdf.save('barcode.pdf');
    } else {
      html2canvas(barcodeElement, {
        backgroundColor: '#ffffff',
      }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL(`image/${format}`);
        link.download = `barcode.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <Sidebar />
      
      <main className="ml-2 pt-2 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Online Barcode Generator</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label>Item Name</Label>
                  <Input
                    value={formData.itemName}
                    onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <Label>Item Code</Label>
                  <Input
                    value={formData.itemCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, itemCode: e.target.value }))}
                    placeholder="Enter item code"
                  />
                </div>

                <div>
                  <Label>Barcode Format</Label>
                  <Select
                    value={formData.format}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CODE128">Code 128</SelectItem>
                      <SelectItem value="EAN13">EAN-13</SelectItem>
                      <SelectItem value="UPC">UPC</SelectItem>
                      <SelectItem value="CODE39">Code 39</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Bar Width (px)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={4}
                    value={formData.width}
                    onChange={(e) => setFormData(prev => ({ ...prev, width: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label>Bar Height (px)</Label>
                  <Input
                    type="number"
                    min={50}
                    max={200}
                    value={formData.height}
                    onChange={(e) => setFormData(prev => ({ ...prev, height: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-center" id="barcode-element">
                  <div className="bg-white p-6 rounded-lg">
                    <Barcode
                      value={formData.itemCode || '1234567890'}
                      format={formData.format as any}
                      width={formData.width}
                      height={formData.height}
                      displayValue={true}
                      font="monospace"
                      textAlign="center"
                      textPosition="bottom"
                      textMargin={2}
                      fontSize={16}
                      background="#ffffff"
                      lineColor="#000000"
                      margin={10}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Download As</Label>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleDownload('png')} 
                      className="flex-1"
                    >
                      PNG
                    </Button>
                    <Button 
                      onClick={() => handleDownload('jpg')} 
                      className="flex-1"
                    >
                      JPG
                    </Button>
                    <Button 
                      onClick={() => handleDownload('pdf')} 
                      className="flex-1"
                    >
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BarcodeGenerator; 