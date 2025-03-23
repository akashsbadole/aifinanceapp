import React, { useState, ChangeEvent } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import html2canvas from 'html2canvas';

interface BusinessCardData {
  businessName: string;
  contactNumber1: string;
  contactNumber2: string;
  email: string;
  website: string;
  address: string;
  logo: string | null;
}

const BusinessCardMaker: React.FC = () => {
  const [formData, setFormData] = useState<BusinessCardData>({
    businessName: '',
    contactNumber1: '',
    contactNumber2: '',
    email: '',
    website: '',
    address: '',
    logo: null
  });

  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async (format: 'png' | 'jpg') => {
    const cardElement = document.getElementById('business-card-preview');
    if (!cardElement) return;

    const canvas = await html2canvas(cardElement, {
      backgroundColor: '#ffffff',
      scale: 2 // Higher quality
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL(`image/${format}`);
    link.download = `business-card.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const templateStyles = [
    "bg-gradient-to-r from-red-600 to-red-700",
    "bg-gradient-to-r from-blue-600 to-blue-700",
    "bg-gradient-to-r from-yellow-500 to-orange-500",
    "bg-gradient-to-r from-cyan-500 to-blue-500",
    "bg-gradient-to-r from-gray-700 to-gray-900",
    "bg-gradient-to-r from-orange-400 to-orange-600",
    "bg-gradient-to-r from-indigo-600 to-purple-600",
    "bg-gradient-to-r from-green-500 to-emerald-500",
    "bg-gradient-to-r from-emerald-500 to-teal-500",
    "bg-gradient-to-r from-rose-500 to-red-500"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Business Card Maker</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label>Business Name <span className="text-red-500">*</span></Label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Enter business name"
                  />
                </div>

                <div>
                  <Label>Contact Number 1 <span className="text-red-500">*</span></Label>
                  <Input
                    value={formData.contactNumber1}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactNumber1: e.target.value }))}
                    placeholder="+91 99999 00000"
                  />
                </div>

                <div>
                  <Label>Contact Number 2</Label>
                  <Input
                    value={formData.contactNumber2}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactNumber2: e.target.value }))}
                    placeholder="+91 99999 00000"
                  />
                </div>

                <div>
                  <Label>Email <span className="text-red-500">*</span></Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@gmail.com"
                  />
                </div>

                <div>
                  <Label>Website</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="www.example.in"
                  />
                </div>

                <div>
                  <Label>Address <span className="text-red-500">*</span></Label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Address line 1,&#10;Address line 2,&#10;City, State,&#10;PIN"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Upload Logo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-6">
                <Label className="mb-4 block">Select Template</Label>
                <div className="grid grid-cols-5 gap-2">
                  {templateStyles.map((style, index) => (
                    <button
                      key={index}
                      className={`w-full aspect-[1.6/1] rounded-lg ${style} cursor-pointer transition-transform hover:scale-105 ${selectedTemplate === index ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedTemplate(index)}
                    />
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <Label className="mb-4 block">Preview</Label>
                <div id="business-card-preview" className="w-full aspect-[1.6/1] rounded-lg overflow-hidden">
                  <div className={`w-full h-full ${templateStyles[selectedTemplate]} p-6 text-white relative`}>
                    {formData.logo && (
                      <div className="absolute top-6 right-6 w-16 h-16 bg-white rounded-lg overflow-hidden">
                        <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-bold">{formData.businessName || 'Business Name'}</h2>
                      </div>
                      <div className="space-y-1 text-sm">
                        {formData.contactNumber1 && <p>📞 {formData.contactNumber1}</p>}
                        {formData.contactNumber2 && <p>📞 {formData.contactNumber2}</p>}
                        {formData.email && <p>✉️ {formData.email}</p>}
                        {formData.website && <p>🌐 {formData.website}</p>}
                        {formData.address && <p>📍 {formData.address}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <Button 
                    onClick={() => handleDownload('png')} 
                    className="flex-1"
                  >
                    Download PNG
                  </Button>
                  <Button 
                    onClick={() => handleDownload('jpg')} 
                    className="flex-1"
                  >
                    Download JPG
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessCardMaker; 