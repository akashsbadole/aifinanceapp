import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

interface Item {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

const UNITS = [
  { value: 'GM', label: 'GRAMMES (GM)' },
  { value: 'KG', label: 'KILOGRAMS (KG)' },
  { value: 'LTR', label: 'LITRE (LTR)' },
  { value: 'ML', label: 'MILILITRE (ML)' },
  { value: 'NOS', label: 'NUMBERS (NOS)' },
  { value: 'PAC', label: 'PACKS (PAC)' },
  { value: 'PCS', label: 'PIECES (PCS)' },
];

interface EstimateForm {
  companyName: string;
  companyAddress: string;
  companyGSTIN: string;
  customerName: string;
  customerAddress: string;
  estimateNo: string;
  date: string;
  validity: string;
  items: Item[];
  includeGST: boolean;
  notes: string;
  termsAndConditions: string;
  companyLogo?: File;
}

const EstimateQuotation: React.FC = () => {
  const [activeStep, setActiveStep] = useState<'form' | 'preview'>('form');
  const [formData, setFormData] = useState<EstimateForm>({
    companyName: '',
    companyAddress: '',
    companyGSTIN: '',
    customerName: '',
    customerAddress: '',
    estimateNo: '',
    date: new Date().toISOString().split('T')[0],
    validity: '',
    items: [{ id: 1, name: '', quantity: 0, unit: '', rate: 0, amount: 0 }],
    includeGST: false,
    notes: '',
    termsAndConditions: 'Thanks for doing business with us !',
  });
  const formRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: number, field: keyof Item, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { id: prev.items.length + 1, name: '', quantity: 0, unit: '', rate: 0, amount: 0 }],
    }));
  };

  const removeItem = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, companyLogo: file }));
    }
  };

  const generatePDF = async () => {
    const pdfContent = document.querySelector('.pdf-content');
    if (!pdfContent) return;
    
    const canvas = await html2canvas(pdfContent as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgWidth = 190; // A4 width with margins
    const pageHeight = 277; // A4 height with margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    let heightLeft = imgHeight;
    let position = 10; // starting position
    let pageNumber = 1;

    // Add first page
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      10,
      position,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );
    heightLeft -= pageHeight;

    // Add subsequent pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10; // 10 is top margin
      pdf.addPage();
      pageNumber++;
      
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        10,
        position,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );
      
      heightLeft -= pageHeight;
    }

    pdf.save('estimate.pdf');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className=" pt-16 min-h-screen">
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Create Estimate/Quotation</h1>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              className={`px-4 py-2 ${activeStep === 'form' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveStep('form')}
            >
              Enter Details
            </button>
            <button
              className={`px-4 py-2 ${activeStep === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveStep('preview')}
            >
              Preview
            </button>
          </div>

          <div ref={formRef} className={`bg-white rounded-lg shadow-lg ${
            activeStep === 'preview' ? 'w-[210mm] mx-auto p-[20mm] min-h-[297mm]' : 'p-8'
          }`}>
            {activeStep === 'form' ? (
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Your Company Name"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <textarea
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  placeholder="Company Address"
                  className="w-full p-2 border rounded"
                />
                <div className="grid grid-cols-2 gap-6">
                <input
                  type="text"
                  name="companyGSTIN"
                  value={formData.companyGSTIN}
                  onChange={handleInputChange}
                  placeholder="Your Company GSTIN"
                  className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="estimateNo"
                    value={formData.estimateNo}
                    onChange={handleInputChange}
                    placeholder="Estimate no."
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <h2>Estimate for:</h2><br/>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Customer's Name"
                    className="w-full p-2 border rounded"
                  />
                   <textarea
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleInputChange}
                  placeholder="Customer Address"
                  className="w-full p-2 border rounded"
                />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <h4>Date <span>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                    </span></h4>
                  
                  <h4>Validity <span><input
                    type="date"
                    name="validity"
                    value={formData.validity}
                    onChange={handleInputChange}
                    placeholder="Validity"
                    className="w-full p-2 border rounded"
                  /></span></h4>
                  
                </div>

                <table className="w-full">
                  <thead>
                    <tr>
                      <th>S.N.</th>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Rate</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))}
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td>
                          <select
                            value={item.unit}
                            onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                            className="w-full p-2 border rounded"
                          >
                            <option value="">Select Unit</option>
                            {UNITS.map((unit) => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value))}
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td>₹ {item.amount.toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-blue-500"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button
                  type="button"
                  onClick={addItem}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  + Add Item
                </button>

                <div className="flex items-center gap-2">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.includeGST}
                      onChange={(e) => setFormData((prev) => ({ ...prev, includeGST: e.target.checked }))}
                    />
                    Include GST
                  </label>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">Total: ₹ {calculateTotal().toFixed(2)}</p>
                </div>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Notes"
                  className="w-full p-2 border rounded"
                />

                <textarea
                  name="termsAndConditions"
                  value={formData.termsAndConditions}
                  onChange={handleInputChange}
                  placeholder="Terms & Conditions"
                  className="w-full p-2 border rounded"
                />
              </form>
            ) : (
              <>
                <div className="pdf-content px-8">
                  <div className="space-y-6 max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-12">Estimate/Quotation</h1>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold">{formData.companyName}</h2>
                        <p className="whitespace-pre-line">{formData.companyAddress}</p>
                        <p>GSTIN: {formData.companyGSTIN}</p>
                      </div>
                      {formData.companyLogo && (
                        <img
                          src={URL.createObjectURL(formData.companyLogo)}
                          alt="Company Logo"
                          className="w-24 h-20 object-contain"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                      <div>
                        <h3 className="font-semibold mb-2">Estimate for:</h3>
                        <p className="font-medium">{formData.customerName}</p>
                        <p className="whitespace-pre-line text-gray-700">{formData.customerAddress}</p>
                      </div>
                      <div className="text-right">
                        <p><span className="font-semibold">Estimate No:</span> {formData.estimateNo}</p>
                        <p><span className="font-semibold">Date:</span> {formData.date}</p>
                        <p><span className="font-semibold">Valid until:</span> {formData.validity}</p>
                      </div>
                    </div>

                    <table className="w-full border-collapse mt-6">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-3 text-center">S.N.</th>
                          <th className="border p-3 text-left">Item</th>
                          <th className="border p-3 text-center">Quantity</th>
                          <th className="border p-3 text-center">Unit</th>
                          <th className="border p-3 text-right">Rate</th>
                          <th className="border p-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item) => (
                          <tr key={item.id}>
                            <td className="border p-3 text-center">{item.id}</td>
                            <td className="border p-3">{item.name}</td>
                            <td className="border p-3 text-center">{item.quantity}</td>
                            <td className="border p-3 text-center">{item.unit}</td>
                            <td className="border p-3 text-right">₹ {item.rate.toFixed(2)}</td>
                            <td className="border p-3 text-right">₹ {item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="text-right mt-4">
                      <p className="text-xl font-bold">Total: ₹ {calculateTotal().toFixed(2)}</p>
                    </div>

                    {formData.notes && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Notes:</h3>
                        <p className="whitespace-pre-line text-gray-700">{formData.notes}</p>
                      </div>
                    )}

                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">Terms & Conditions:</h3>
                      <p className="whitespace-pre-line text-gray-700">{formData.termsAndConditions}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={generatePDF}
                    className="bg-blue-500 text-white px-6 py-2 rounded"
                  >
                    Download PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="ml-64 mt-auto border-t">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BizNest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EstimateQuotation;
