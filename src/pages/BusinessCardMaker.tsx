import React, { useState, ChangeEvent } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import html2canvas from 'html2canvas';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BusinessCardData {
  businessName: string;
  contactNumber1: string;
  contactNumber2: string;
  email: string;
  website: string;
  address: string;
  logo: string | null;
  jobTitle: string;
  socialMedia: {
    facebook: string;
    instagram: string;
  };
  backgroundColor: string;
  customColor: string;
  useGradient: boolean;
  gradientDirection: string;
  gradientFromColor: string;
  gradientToColor: string;
}

const BusinessCardMaker: React.FC = () => {
  const [formData, setFormData] = useState<BusinessCardData>({
    businessName: '',
    contactNumber1: '',
    contactNumber2: '',
    email: '',
    website: '',
    address: '',
    logo: null,
    jobTitle: '',
    socialMedia: {
      facebook: '',
      instagram: ''
    },
    backgroundColor: 'bg-white',
    customColor: '#ffffff',
    useGradient: false,
    gradientDirection: 'bg-gradient-to-r',
    gradientFromColor: 'from-blue-500',
    gradientToColor: 'to-purple-500',
  });

  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);

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
    {
      name: "Minimal White",
      background: "bg-white",
      textColor: "text-gray-800",
      titleColor: "text-gray-900",
      accentColor: "text-green-500",
      border: "border border-gray-100",
      layout: "default"
    },
    {
      name: "Two Column",
      background: "bg-white",
      textColor: "text-gray-800",
      titleColor: "text-gray-900",
      accentColor: "text-blue-600",
      border: "border border-gray-100",
      layout: "two-column"
    },
    {
      name: "Single Column",
      background: "bg-white",
      textColor: "text-gray-800",
      titleColor: "text-gray-900",
      accentColor: "text-purple-600",
      border: "border border-gray-100",
      layout: "single-column"
    }
  ];

  const solidColors = [
    { name: 'White', value: 'bg-white' },
    { name: 'Gray', value: 'bg-gray-100' },
    { name: 'Blue', value: 'bg-blue-50' },
    { name: 'Green', value: 'bg-green-50' },
    { name: 'Yellow', value: 'bg-yellow-50' },
    { name: 'Red', value: 'bg-red-50' },
    { name: 'Purple', value: 'bg-purple-50' },
    { name: 'Pink', value: 'bg-pink-50' },
    { name: 'Indigo', value: 'bg-indigo-50' },
    { name: 'Teal', value: 'bg-teal-50' },
    { name: 'Orange', value: 'bg-orange-50' },
    { name: 'Cyan', value: 'bg-cyan-50' },
  ];

  const gradientPresets = [
    { from: 'from-blue-500', to: 'to-purple-500' },
    { from: 'from-green-400', to: 'to-blue-500' },
    { from: 'from-pink-500', to: 'to-yellow-500' },
    { from: 'from-purple-500', to: 'to-red-500' },
    { from: 'from-yellow-400', to: 'to-orange-500' },
    { from: 'from-teal-400', to: 'to-blue-500' },
  ];

  const gradientDirections = [
    { name: 'Right', value: 'bg-gradient-to-r' },
    { name: 'Left', value: 'bg-gradient-to-l' },
    { name: 'Bottom', value: 'bg-gradient-to-b' },
    { name: 'Top', value: 'bg-gradient-to-t' },
  ];

  const getBackgroundStyle = (formData: BusinessCardData) => {
    if (formData.useGradient) {
      return `${formData.gradientDirection} ${formData.gradientFromColor} ${formData.gradientToColor}`;
    }
    
    return formData.backgroundColor;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-2 pt-2 min-h-screen">
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
                  <Label>Job Title <span className="text-red-500">*</span></Label>
                  <Input
                    value={formData.jobTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    placeholder="e.g. Landscape Designer"
                  />
                </div>

                <div>
                  <Label>Contact Number <span className="text-red-500">*</span></Label>
                  <Input
                    value={formData.contactNumber1}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactNumber1: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <Label>Email <span className="text-red-500">*</span></Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <Label>Website</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="www.company.com"
                  />
                </div>

                <div>
                  <Label>Social Media</Label>
                  <div className="space-y-2">
                    <Input
                      value={formData.socialMedia.facebook}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                      }))}
                      placeholder="fb.com/company"
                    />
                    <Input
                      value={formData.socialMedia.instagram}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                      }))}
                      placeholder="instagram.com/company"
                    />
                  </div>
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
                <div className="grid grid-cols-2 gap-4">
                  {templateStyles.map((style, index) => (
                    <button
                      key={index}
                      className={`w-full aspect-[1.6/1] rounded-lg ${style.background} ${style.border} cursor-pointer transition-all hover:scale-105 ${selectedTemplate === index ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      onClick={() => setSelectedTemplate(index)}
                    >
                      <div className={`text-xs font-medium ${style.textColor}`}>{style.name}</div>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Label>Background Style</Label>
                  <div className="flex items-center gap-4">
                    <button
                      className={`px-3 py-1 rounded-md text-sm ${!formData.useGradient ? 'bg-primary text-white' : 'bg-gray-100'}`}
                      onClick={() => setFormData(prev => ({ ...prev, useGradient: false }))}
                    >
                      Solid
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-sm ${formData.useGradient ? 'bg-primary text-white' : 'bg-gray-100'}`}
                      onClick={() => setFormData(prev => ({ ...prev, useGradient: true }))}
                    >
                      Gradient
                    </button>
                  </div>
                </div>

                {!formData.useGradient ? (
                  <>
                    <div className="grid grid-cols-6 gap-2 mb-4">
                      {solidColors.map((color) => (
                        <button
                          key={color.value}
                          className={`group relative aspect-square rounded-lg ${color.value} border border-gray-200 transition-all hover:scale-105 ${
                            formData.backgroundColor === color.value ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, backgroundColor: color.value }))}
                        >
                          <span className="absolute inset-0 flex items-center justify-center">
                            {formData.backgroundColor === color.value && (
                              <div className="rounded-full bg-primary/10 p-1">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                              </div>
                            )}
                          </span>
                          <span className="absolute bottom-1 left-1 right-1 text-[10px] text-center font-medium text-gray-700 dark:text-gray-300">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Custom Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={formData.customColor}
                          onChange={(e) => {
                            const color = e.target.value.toLowerCase();
                            setFormData(prev => ({ 
                              ...prev, 
                              customColor: color,
                              backgroundColor: 'custom'
                            }));
                          }}
                          className="w-20 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={formData.customColor}
                          onChange={(e) => {
                            let color = e.target.value.toLowerCase();
                            // Ensure color starts with #
                            if (color && !color.startsWith('#')) {
                              color = '#' + color;
                            }
                            // Validate hex color format
                            if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color)) {
                              setFormData(prev => ({ 
                                ...prev, 
                                customColor: color,
                                backgroundColor: 'custom'
                              }));
                            }
                          }}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Label className="mb-2 block">Gradient Direction</Label>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {gradientDirections.map((direction) => (
                        <button
                          key={direction.value}
                          className={`px-3 py-2 rounded-md text-sm ${
                            formData.gradientDirection === direction.value ? 'bg-primary text-white' : 'bg-gray-100'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, gradientDirection: direction.value }))}
                        >
                          {direction.name}
                        </button>
                      ))}
                    </div>

                    <Label className="mb-2 block">Gradient Presets</Label>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {gradientPresets.map((preset, index) => (
                        <button
                          key={index}
                          className={`h-20 rounded-lg bg-gradient-to-r ${preset.from} ${preset.to} transition-all hover:scale-105 ${
                            formData.gradientFromColor === preset.from && formData.gradientToColor === preset.to
                              ? 'ring-2 ring-primary ring-offset-2'
                              : ''
                          }`}
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            gradientFromColor: preset.from,
                            gradientToColor: preset.to
                          }))}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Color</Label>
                        <Input
                          type="color"
                          value={formData.gradientFromColor.replace('from-', '#')}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            gradientFromColor: `from-[${e.target.value}]`
                          }))}
                          className="w-full h-10 mt-1"
                        />
                      </div>
                      <div>
                        <Label>End Color</Label>
                        <Input
                          type="color"
                          value={formData.gradientToColor.replace('to-', '#')}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            gradientToColor: `to-[${e.target.value}]`
                          }))}
                          className="w-full h-10 mt-1"
                        />
                      </div>
                    </div>
                  </>
                )}
              </Card>

              <Card className="p-6">
                <Label className="mb-4 block">Preview</Label>
                <div id="business-card-preview" className="w-full aspect-[1.6/1] rounded-lg overflow-hidden shadow-lg">
                  <div 
                    className={`w-full h-full ${formData.backgroundColor === 'custom' ? '' : getBackgroundStyle(formData)} ${templateStyles[selectedTemplate].border} p-8 relative`}
                    style={formData.backgroundColor === 'custom' ? { backgroundColor: formData.customColor } : undefined}
                  >
                    {templateStyles[selectedTemplate].layout === 'default' && (
                      <>
                        <div className="flex items-start justify-between">
                          {formData.logo && (
                            <div className="w-32 h-auto">
                              <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                          )}
                          <div className={`flex-1 text-right ${templateStyles[selectedTemplate].titleColor}`}>
                            <h2 className="text-2xl font-bold tracking-tight mb-1">{formData.businessName || 'Business Name'}</h2>
                            <p className={`text-lg ${templateStyles[selectedTemplate].accentColor}`}>
                              {formData.jobTitle || 'Job Title'}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`mt-auto pt-12 text-right space-y-0.5 ${templateStyles[selectedTemplate].textColor}`}>
                          {formData.contactNumber1 && (
                            <p className="text-sm font-medium">{formData.contactNumber1}</p>
                          )}
                          {formData.email && (
                            <p className="text-sm font-medium">{formData.email}</p>
                          )}
                          {formData.website && (
                            <p className="text-sm font-medium">{formData.website}</p>
                          )}
                          {(formData.socialMedia.facebook || formData.socialMedia.instagram) && (
                            <div className="text-sm font-medium">
                              {formData.socialMedia.facebook && <p>{formData.socialMedia.facebook}</p>}
                              {formData.socialMedia.instagram && <p>{formData.socialMedia.instagram}</p>}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {templateStyles[selectedTemplate].layout === 'two-column' && (
                      <div className="flex h-full">
                        <div className="w-1/2 flex items-center justify-center border-r border-gray-200 pr-6">
                          {formData.logo ? (
                            <div className="w-40 h-auto">
                              <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400">Logo</span>
                            </div>
                          )}
                        </div>
                        <div className="w-1/2 pl-6 flex flex-col justify-center">
                          <div className={templateStyles[selectedTemplate].titleColor}>
                            <h2 className="text-2xl font-bold tracking-tight mb-1">{formData.businessName || 'Business Name'}</h2>
                            <p className={`text-lg mb-4 ${templateStyles[selectedTemplate].accentColor}`}>
                              {formData.jobTitle || 'Job Title'}
                            </p>
                          </div>
                          <div className={`space-y-0.5 ${templateStyles[selectedTemplate].textColor}`}>
                            {formData.contactNumber1 && (
                              <p className="text-sm font-medium">{formData.contactNumber1}</p>
                            )}
                            {formData.email && (
                              <p className="text-sm font-medium">{formData.email}</p>
                            )}
                            {formData.website && (
                              <p className="text-sm font-medium">{formData.website}</p>
                            )}
                            {(formData.socialMedia.facebook || formData.socialMedia.instagram) && (
                              <div className="text-sm font-medium">
                                {formData.socialMedia.facebook && <p>{formData.socialMedia.facebook}</p>}
                                {formData.socialMedia.instagram && <p>{formData.socialMedia.instagram}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {templateStyles[selectedTemplate].layout === 'single-column' && (
                      <div className="flex flex-col items-center h-full">
                        {formData.logo && (
                          <div className="w-28 h-auto mb-4">
                            <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className={`text-center ${templateStyles[selectedTemplate].titleColor}`}>
                          <h2 className="text-2xl font-bold tracking-tight mb-1">{formData.businessName || 'Business Name'}</h2>
                          <p className={`text-lg mb-4 ${templateStyles[selectedTemplate].accentColor}`}>
                            {formData.jobTitle || 'Job Title'}
                          </p>
                        </div>
                        <div className={`text-center space-y-0.5 ${templateStyles[selectedTemplate].textColor}`}>
                          {formData.contactNumber1 && (
                            <p className="text-sm font-medium">{formData.contactNumber1}</p>
                          )}
                          {formData.email && (
                            <p className="text-sm font-medium">{formData.email}</p>
                          )}
                          {formData.website && (
                            <p className="text-sm font-medium">{formData.website}</p>
                          )}
                          {(formData.socialMedia.facebook || formData.socialMedia.instagram) && (
                            <div className="text-sm font-medium">
                              {formData.socialMedia.facebook && <p>{formData.socialMedia.facebook}</p>}
                              {formData.socialMedia.instagram && <p>{formData.socialMedia.instagram}</p>}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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