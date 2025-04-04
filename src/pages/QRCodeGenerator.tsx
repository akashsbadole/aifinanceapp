import React, { useState, useRef, useEffect } from 'react';
// import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Link as LinkIcon, MessageSquare, Phone, Mail, User } from 'lucide-react';
import QRCode from 'qrcode';

type QRType = 'text' | 'url' | 'whatsapp' | 'phone' | 'contact' | 'vcard';

interface ContactData {
  name: string;
  phone: string;
  email: string;
  url: string;
  company?: string;
  title?: string;
}

interface FormData {
  type: QRType;
  content: string;
  size: number;
  contactData: ContactData;
  whatsappMessage?: string;
}

const QRCodeGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<QRType>('text');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [size, setSize] = useState<number>(850);
  const [formData, setFormData] = useState<FormData>({
    type: 'text',
    content: '',
    size: 850,
    contactData: {
      name: '',
      phone: '',
      email: '',
      url: '',
      company: '',
      title: ''
    },
    whatsappMessage: ''
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateVCard = (data: ContactData) => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${data.name}`,
      `TEL;TYPE=CELL:${data.phone}`,
      `EMAIL:${data.email}`,
      data.url && `URL:${data.url}`,
      data.company && `ORG:${data.company}`,
      data.title && `TITLE:${data.title}`,
      'END:VCARD'
    ].filter(Boolean).join('\n');

    return vcard;
  };

  const generateQRCode = async (content: string) => {
    try {
      let finalContent = content;
      
      // Format content based on type
      switch (formData.type) {
        case 'url':
          if (!content.startsWith('http://') && !content.startsWith('https://')) {
            finalContent = 'https://' + content;
          }
          break;
        case 'whatsapp':
          const phone = content.replace(/[^0-9]/g, '');
          const message = encodeURIComponent(formData.whatsappMessage || '');
          finalContent = `https://wa.me/${phone}${message ? '?text=' + message : ''}`;
          break;
        case 'phone':
          finalContent = `tel:${content.replace(/[^0-9]/g, '')}`;
          break;
        case 'contact':
          finalContent = `mailto:${content}`;
          break;
        case 'vcard':
          finalContent = generateVCard(formData.contactData);
          break;
      }

      const options = {
        width: size,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H' as const
      };

      const url = await QRCode.toDataURL(finalContent, options);
      setQrUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  useEffect(() => {
    if (formData.content || formData.type === 'vcard') {
      generateQRCode(formData.type === 'vcard' ? 'generating...' : formData.content);
    }
  }, [formData.content, formData.type, size, formData.contactData, formData.whatsappMessage]);

  const handleDownload = (format: 'png' | 'jpg' | 'pdf') => {
    if (!qrUrl) return;

    const link = document.createElement('a');
    
    if (format === 'pdf') {
      // Create PDF with QR code
      import('jspdf').then(({ default: jsPDF }) => {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgWidth = 150;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const x = (pageWidth - imgWidth) / 2;
        const y = 20;

        pdf.addImage(qrUrl, 'PNG', x, y, imgWidth, imgWidth);
        
        // Add contact information if it's a vCard or WhatsApp
        if (formData.type === 'vcard' || formData.type === 'whatsapp') {
          pdf.setFontSize(12);
          let textY = y + imgWidth + 10;
          
          if (formData.type === 'vcard') {
            const { contactData } = formData;
            pdf.text(`Name: ${contactData.name}`, 20, textY);
            pdf.text(`Phone: ${contactData.phone}`, 20, textY + 7);
            pdf.text(`Email: ${contactData.email}`, 20, textY + 14);
            if (contactData.url) pdf.text(`Website: ${contactData.url}`, 20, textY + 21);
            if (contactData.company) pdf.text(`Company: ${contactData.company}`, 20, textY + 28);
            if (contactData.title) pdf.text(`Title: ${contactData.title}`, 20, textY + 35);
          } else if (formData.type === 'whatsapp') {
            pdf.text(`WhatsApp: ${formData.content}`, 20, textY);
            if (formData.whatsappMessage) {
              pdf.text(`Message: ${formData.whatsappMessage}`, 20, textY + 7);
            }
          }
        }

        pdf.save('qr-code.pdf');
      });
    } else {
      // Download as image
      link.href = qrUrl;
      link.download = `qr-code.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'url':
        return 'Enter website URL';
      case 'whatsapp':
        return 'Enter WhatsApp number';
      case 'phone':
        return 'Enter phone number';
      case 'contact':
        return 'Enter email address';
      case 'vcard':
        return 'Fill contact details below';
      default:
        return 'Enter text';
    }
  };

  const handleContactDataChange = (field: keyof ContactData, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactData: {
        ...prev.contactData,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <Sidebar />
      
      <main className="ml-2 pt-2 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto animate-on-mount">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">QR Code Generator</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <Tabs value={activeTab} onValueChange={(value) => {
                setActiveTab(value as QRType);
                setFormData(prev => ({ 
                  ...prev, 
                  type: value as QRType, 
                  content: '',
                  whatsappMessage: ''
                }));
              }}>
                <TabsList className="grid grid-cols-6 w-full">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                  <TabsTrigger value="contact">Email</TabsTrigger>
                  <TabsTrigger value="vcard">vCard</TabsTrigger>
                </TabsList>

                <div className="mt-6 space-y-4">
                  {activeTab !== 'vcard' && (
                    <div>
                      <Label>
                        {activeTab === 'text' && 'Enter Text'}
                        {activeTab === 'url' && 'Enter URL'}
                        {activeTab === 'whatsapp' && 'Enter WhatsApp Number'}
                        {activeTab === 'phone' && 'Enter Phone Number'}
                        {activeTab === 'contact' && 'Enter Email Address'}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.content}
                          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                          placeholder={getPlaceholder()}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'whatsapp' && (
                    <div>
                      <Label>Message (Optional)</Label>
                      <Input
                        value={formData.whatsappMessage}
                        onChange={(e) => setFormData(prev => ({ ...prev, whatsappMessage: e.target.value }))}
                        placeholder="Enter pre-filled message"
                      />
                    </div>
                  )}

                  {activeTab === 'vcard' && (
                    <div className="space-y-4">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={formData.contactData.name}
                          onChange={(e) => handleContactDataChange('name', e.target.value)}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input
                          value={formData.contactData.phone}
                          onChange={(e) => handleContactDataChange('phone', e.target.value)}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={formData.contactData.email}
                          onChange={(e) => handleContactDataChange('email', e.target.value)}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <Label>Website</Label>
                        <Input
                          value={formData.contactData.url}
                          onChange={(e) => handleContactDataChange('url', e.target.value)}
                          placeholder="Enter website URL"
                        />
                      </div>
                      <div>
                        <Label>Company (Optional)</Label>
                        <Input
                          value={formData.contactData.company}
                          onChange={(e) => handleContactDataChange('company', e.target.value)}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <Label>Job Title (Optional)</Label>
                        <Input
                          value={formData.contactData.title}
                          onChange={(e) => handleContactDataChange('title', e.target.value)}
                          placeholder="Enter job title"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>QR Code Size</Label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="100"
                        max="2000"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-20 text-right">
                        {size} x {size} px
                      </span>
                    </div>
                  </div>
                </div>
              </Tabs>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-center">
                  {qrUrl && (
                    <img 
                      src={qrUrl} 
                      alt="QR Code" 
                      className="max-w-full h-auto border rounded-lg"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Download As</Label>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleDownload('png')} 
                      disabled={!qrUrl}
                      className="flex-1"
                    >
                      PNG
                    </Button>
                    <Button 
                      onClick={() => handleDownload('jpg')} 
                      disabled={!qrUrl}
                      className="flex-1"
                    >
                      JPG
                    </Button>
                    <Button 
                      onClick={() => handleDownload('pdf')} 
                      disabled={!qrUrl}
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

export default QRCodeGenerator; 