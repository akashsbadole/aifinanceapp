
import React from 'react';
import { format } from 'date-fns';

interface BillPreviewProps {
  formData: {
    restaurantName: string;
    address: string;
    contactNumber: string;
    gstNumber?: string;
    tableNo?: string;
    orderNumber?: string;
    waiterName?: string;
    billDate?: string;
    billTime?: string;
    invoiceNumber?: string;
    additionalCharges?: string;
    taxPercentage?: string;
  };
  logoPreview: string;
  billItems: {
    id: string;
    name: string;
    price: string;
    quantity: string;
    total: string;
  }[];
  subTotal: string;
  grandTotal: string;
  template: '1' | '2';
}

const BillPreview: React.FC<BillPreviewProps> = ({
  formData,
  logoPreview,
  billItems,
  subTotal,
  grandTotal,
  template
}) => {
  // Format date to display in proper format
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return format(date, 'dd-MM-yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Calculate tax amount
  const taxAmount = parseFloat(subTotal) * (parseFloat(formData.taxPercentage || '0') / 100);
  
  if (template === '1') {
    return (
      <div className="w-full font-sans">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 pb-4 border-b">
          <div className="flex items-center justify-center mb-2">
            {logoPreview && (
              <img 
                src={logoPreview} 
                alt="Restaurant logo" 
                className="h-16 mr-3" 
              />
            )}
            <h1 className="text-2xl font-bold">{formData.restaurantName || 'Restaurant Name'}</h1>
          </div>
          
          {formData.address && (
            <p className="text-center text-sm mb-1">{formData.address}</p>
          )}
          
          {formData.contactNumber && (
            <p className="text-sm mb-1">Phone: {formData.contactNumber}</p>
          )}
          
          {formData.gstNumber && (
            <p className="text-sm">GST No: {formData.gstNumber}</p>
          )}
        </div>
        
        {/* Bill Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm"><span className="font-semibold">Table:</span> {formData.tableNo || '-'}</p>
            <p className="text-sm"><span className="font-semibold">Order:</span> {formData.orderNumber || '-'}</p>
            <p className="text-sm"><span className="font-semibold">Waiter:</span> {formData.waiterName || '-'}</p>
          </div>
          
          <div className="space-y-1 text-right">
            <p className="text-sm"><span className="font-semibold">Date:</span> {formatDate(formData.billDate)}</p>
            <p className="text-sm"><span className="font-semibold">Time:</span> {formData.billTime || '-'}</p>
            <p className="text-sm"><span className="font-semibold">Invoice:</span> {formData.invoiceNumber || '-'}</p>
            <p className="text-sm"><span className="font-semibold">Pay In:</span> Cash</p>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Order Details</h2>
          
          <div className="w-full border-t border-b py-2">
            <div className="grid grid-cols-12 font-semibold text-sm">
              <div className="col-span-1">Item</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
          </div>
          
          <div className="w-full">
            {billItems.filter(item => item.name.trim() !== '').map((item) => (
              <div key={item.id} className="grid grid-cols-12 text-sm py-2 border-b">
                <div className="col-span-1">{item.id}</div>
                <div className="col-span-5">{item.name}</div>
                <div className="col-span-2 text-right">{item.quantity}</div>
                <div className="col-span-2 text-right">₹{parseFloat(item.price).toFixed(2)}</div>
                <div className="col-span-2 text-right">₹{parseFloat(item.total).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          {/* If no items have names, show a placeholder row */}
          {billItems.filter(item => item.name.trim() !== '').length === 0 && (
            <div className="grid grid-cols-12 text-sm py-2 border-b">
              <div className="col-span-1">1</div>
              <div className="col-span-5">Sample Item</div>
              <div className="col-span-2 text-right">1</div>
              <div className="col-span-2 text-right">₹0.00</div>
              <div className="col-span-2 text-right">₹0.00</div>
            </div>
          )}
        </div>
        
        {/* Bill Summary */}
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Sub Total:</span>
                <span className="text-sm">₹{subTotal}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Additional Charges:</span>
                <span className="text-sm">₹{parseFloat(formData.additionalCharges || '0').toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Tax ({formData.taxPercentage || '0'}%):</span>
                <span className="text-sm">₹{taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-semibold pt-1 border-t">
                <span>Grand Total:</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-10 pt-4 border-t text-center">
          <p className="text-sm">Thank You For Dining At Our Restaurant!</p>
        </div>
      </div>
    );
  } else {
    // Template 2 (Minimal)
    return (
      <div className="w-full font-sans">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">{formData.restaurantName || 'Restaurant Name'}</h1>
            {formData.address && (
              <p className="text-sm mb-1">{formData.address}</p>
            )}
            {formData.contactNumber && (
              <p className="text-sm mb-1">Phone: {formData.contactNumber}</p>
            )}
            {formData.gstNumber && (
              <p className="text-sm">GST No: {formData.gstNumber}</p>
            )}
          </div>
          
          {logoPreview && (
            <img 
              src={logoPreview} 
              alt="Restaurant logo" 
              className="h-16" 
            />
          )}
        </div>
        
        {/* Invoice Title */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-center">INVOICE</h2>
        </div>
        
        {/* Bill Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm"><span className="font-semibold">Table:</span> {formData.tableNo || '-'}</p>
            <p className="text-sm"><span className="font-semibold">Order:</span> {formData.orderNumber || '-'}</p>
            <p className="text-sm"><span className="font-semibold">Waiter:</span> {formData.waiterName || '-'}</p>
          </div>
          
          <div className="space-y-1 text-right">
            <p className="text-sm"><span className="font-semibold">Date:</span> {formatDate(formData.billDate)}</p>
            <p className="text-sm"><span className="font-semibold">Time:</span> {formData.billTime || '-'}</p>
            <p className="text-sm"><span className="font-semibold">Invoice:</span> {formData.invoiceNumber || '-'}</p>
            <p className="text-sm"><span className="font-semibold">Pay In:</span> Cash</p>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="mb-6">
          <h2 className="font-semibold text-sm uppercase mb-2">Order Details</h2>
          
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y">
                <th className="py-2 text-left font-medium">Item</th>
                <th className="py-2 text-center font-medium">Qty</th>
                <th className="py-2 text-right font-medium">Price</th>
                <th className="py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {billItems.filter(item => item.name.trim() !== '').map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">₹{parseFloat(item.price).toFixed(2)}</td>
                  <td className="py-2 text-right">₹{parseFloat(item.total).toFixed(2)}</td>
                </tr>
              ))}
              
              {/* If no items have names, show a placeholder row */}
              {billItems.filter(item => item.name.trim() !== '').length === 0 && (
                <tr className="border-b">
                  <td className="py-2">Sample Item</td>
                  <td className="py-2 text-center">1</td>
                  <td className="py-2 text-right">₹0.00</td>
                  <td className="py-2 text-right">₹0.00</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Bill Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-1/2">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Sub Total:</span>
                <span className="text-sm">₹{subTotal}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Additional Charges:</span>
                <span className="text-sm">₹{parseFloat(formData.additionalCharges || '0').toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Tax ({formData.taxPercentage || '0'}%):</span>
                <span className="text-sm">₹{taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-semibold pt-1 border-t">
                <span>Grand Total:</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-10 pt-4 border-t text-center">
          <p className="text-sm">Thank You For Dining At Our Restaurant!</p>
        </div>
      </div>
    );
  }
};

export default BillPreview;
