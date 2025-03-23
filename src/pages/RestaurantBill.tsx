
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { 
  Plus,
  Trash,
  Upload,
  Download,
  Printer,
  IndianRupee
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BillPreview from '@/components/restaurant-bill/BillPreview';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Form schema
const billFormSchema = z.object({
  restaurantName: z.string().min(1, 'Restaurant name is required'),
  address: z.string().min(1, 'Address is required'),
  contactNumber: z.string().min(10, 'Valid contact number required'),
  gstNumber: z.string().optional(),
  tableNo: z.string().optional(),
  orderNumber: z.string().optional(),
  waiterName: z.string().optional(),
  billDate: z.string().optional(),
  billTime: z.string().optional(),
  invoiceNumber: z.string().optional(),
  additionalCharges: z.string().optional(),
  taxPercentage: z.string().optional(),
});

type BillFormValues = z.infer<typeof billFormSchema>;

// Item type
interface BillItem {
  id: string;
  name: string;
  price: string;
  quantity: string;
  total: string;
}

const RestaurantBill = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<'1' | '2'>('1');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [billItems, setBillItems] = useState<BillItem[]>([
    { id: '1', name: '', price: '0', quantity: '1', total: '0' }
  ]);
  const [subTotal, setSubTotal] = useState('0.00');
  const [grandTotal, setGrandTotal] = useState('0.00');
  const { toast } = useToast();
  const billPreviewRef = useRef<HTMLDivElement>(null);

  // Initialize form
  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      restaurantName: '',
      address: '',
      contactNumber: '',
      gstNumber: '',
      tableNo: '',
      orderNumber: '',
      waiterName: '',
      billDate: getCurrentDate(),
      billTime: getCurrentTime(),
      invoiceNumber: generateInvoiceNumber(),
      additionalCharges: '0',
      taxPercentage: '5',
    }
  });

  // Generate invoice number
  function generateInvoiceNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  }

  // Get current date in YYYY-MM-DD format
  function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  // Get current time in HH:MM format
  function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0].substring(0, 5);
  }

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Logo uploaded",
        description: "Your restaurant logo has been uploaded successfully.",
      });
    }
  };

  // Add a new item to the bill
  const addItem = () => {
    const newId = (billItems.length + 1).toString();
    setBillItems([
      ...billItems, 
      { id: newId, name: '', price: '0', quantity: '1', total: '0' }
    ]);
  };

  // Remove an item from the bill
  const removeItem = (id: string) => {
    if (billItems.length === 1) {
      toast({
        title: "Cannot remove item",
        description: "You need at least one item in the bill.",
        variant: "destructive",
      });
      return;
    }
    
    setBillItems(billItems.filter(item => item.id !== id));
  };

  // Update item
  const updateItem = (id: string, field: keyof BillItem, value: string) => {
    const updatedItems = billItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total if price or quantity changed
        if (field === 'price' || field === 'quantity') {
          const price = parseFloat(updatedItem.price || '0');
          const quantity = parseFloat(updatedItem.quantity || '1');
          updatedItem.total = (price * quantity).toFixed(2);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setBillItems(updatedItems);
  };

  // Calculate subtotal and grand total whenever items change
  useEffect(() => {
    // Calculate subtotal
    const calculatedSubTotal = billItems.reduce((sum, item) => {
      return sum + parseFloat(item.total || '0');
    }, 0);
    
    setSubTotal(calculatedSubTotal.toFixed(2));
    
    // Calculate grand total including tax and additional charges
    const additionalCharges = parseFloat(form.getValues('additionalCharges') || '0');
    const taxPercentage = parseFloat(form.getValues('taxPercentage') || '0');
    const taxAmount = calculatedSubTotal * (taxPercentage / 100);
    
    const calculatedGrandTotal = calculatedSubTotal + additionalCharges + taxAmount;
    setGrandTotal(calculatedGrandTotal.toFixed(2));
  }, [billItems, form.watch('additionalCharges'), form.watch('taxPercentage')]);

  // Print the bill
  const printBill = () => {
    const printContent = document.createElement('div');
    if (billPreviewRef.current) {
      printContent.innerHTML = billPreviewRef.current.innerHTML;
      
      // Store the current body content
      const originalBody = document.body.innerHTML;
      
      // Replace with our print content
      document.body.innerHTML = `
        <style>
          body { 
            font-family: Arial, sans-serif;
            padding: 20px;
            margin: 0;
            background: white;
          }
          @page {
            size: auto;
            margin: 10mm;
          }
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
            }
          }
        </style>
        <div>${printContent.innerHTML}</div>
      `;
      
      // Print
      window.print();
      
      // Restore the original content
      document.body.innerHTML = originalBody;
      
      // Notify user
      toast({
        title: "Printing bill",
        description: "The bill has been sent to your printer.",
      });
    }
  };

  // Download the bill as PDF
  const downloadBill = () => {
    if (!billPreviewRef.current) {
      toast({
        title: "Error",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Generating PDF",
      description: "Please wait while we generate your bill PDF.",
    });

    const element = billPreviewRef.current;
    
    html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // If the bill is longer than one page
      if (imgHeight > pageHeight) {
        let remainingHeight = imgHeight;
        let position = -pageHeight;
        
        while (remainingHeight > 0) {
          position += pageHeight;
          remainingHeight -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
        }
      }
      
      const fileName = `${form.getValues().restaurantName || 'Restaurant'}_Bill_${form.getValues().invoiceNumber || new Date().getTime()}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "Download complete",
        description: `Your bill has been downloaded as "${fileName}".`,
      });
    }).catch(error => {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto animate-on-mount">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-2xl font-bold">Restaurant Bill Generator</h1>
          </div>
          
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid grid-cols-2 w-[200px] mb-6">
              <TabsTrigger value="form">Create Bill</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            {/* Form content tab */}
            <TabsContent value="form" className="space-y-6">
              <Form {...form}>
                <form className="space-y-6">
                  {/* Restaurant Details */}
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-4">Restaurant Details</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="restaurantName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Restaurant Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter restaurant name" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Enter address" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="contactNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter Contact Number" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="gstNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GST Number (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter GST Number" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <div className="mt-6">
                            <FormLabel className="block mb-2">Upload Logo</FormLabel>
                            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-32 w-full relative bg-gray-50 hover:bg-gray-100 cursor-pointer">
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                onChange={handleLogoUpload}
                              />
                              {logoPreview ? (
                                <img 
                                  src={logoPreview} 
                                  alt="Restaurant logo preview" 
                                  className="h-full w-full object-contain p-2" 
                                />
                              ) : (
                                <div className="text-center">
                                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                  <span className="block mt-1 text-sm text-gray-500">
                                    Add Custom Logo
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Template Selection */}
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-4">Select Template</h2>
                      <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div 
                          className={`border-2 rounded-md cursor-pointer overflow-hidden ${selectedTemplate === '1' ? 'border-primary' : 'border-gray-200'}`} 
                          onClick={() => setSelectedTemplate('1')}
                        >
                          <div className="bg-primary text-white text-center p-2">
                            1
                          </div>
                          <div className="p-4 text-center text-sm">Standard</div>
                        </div>
                        
                        <div 
                          className={`border-2 rounded-md cursor-pointer overflow-hidden ${selectedTemplate === '2' ? 'border-primary' : 'border-gray-200'}`} 
                          onClick={() => setSelectedTemplate('2')}
                        >
                          <div className="bg-white text-primary border-b border-gray-200 text-center p-2">
                            2
                          </div>
                          <div className="p-4 text-center text-sm">Minimal</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Bill Details */}
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-4">Bill Details</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="tableNo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Table No</FormLabel>
                              <FormControl>
                                <Input placeholder="Table No." {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="orderNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Order Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Order No." {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="waiterName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Waiter Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Waiter" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="billDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bill Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="billTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bill Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="invoiceNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Invoice Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Invoice Number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Item Details */}
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-4">Item Details</h2>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-4 font-medium text-sm">
                          <div className="col-span-1">S.No.</div>
                          <div className="col-span-5">Item Name</div>
                          <div className="col-span-2">Price</div>
                          <div className="col-span-2">Quantity</div>
                          <div className="col-span-1">Total</div>
                          <div className="col-span-1"></div>
                        </div>
                        
                        {billItems.map((item) => (
                          <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-1 text-sm">{item.id}</div>
                            <div className="col-span-5">
                              <Input 
                                placeholder="Item name" 
                                value={item.name}
                                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type="number"
                                  placeholder="0"
                                  className="pl-9"
                                  min="0"
                                  step="0.01"
                                  value={item.price}
                                  onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-span-2">
                              <Input 
                                type="number"
                                placeholder="1"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                              />
                            </div>
                            <div className="col-span-1">
                              <Input 
                                type="text"
                                placeholder="0.00"
                                readOnly
                                value={item.total}
                              />
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeItem(item.id)}
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={addItem}
                          className="mt-2"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Item
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Totals and Payment */}
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-4">Totals</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="font-medium">Sub Total:</span>
                            <span>₹{subTotal}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Additional Charges:</span>
                            <div className="w-32">
                              <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type="number"
                                  placeholder="0"
                                  className="pl-9"
                                  min="0"
                                  step="0.01"
                                  {...form.register('additionalCharges')}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Tax:</span>
                            <div className="w-32 flex items-center gap-2">
                              <Input 
                                type="number"
                                placeholder="5"
                                min="0"
                                max="100"
                                className="w-20"
                                {...form.register('taxPercentage')}
                              />
                              <span>%</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Grand Total:</span>
                            <span>₹{grandTotal}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="font-medium mb-2">Payment Options</h3>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-accent/50">
                              <img src="https://cdn-icons-png.flaticon.com/512/6981/6981673.png" alt="Google Pay" className="h-12 w-12 object-contain" />
                            </div>
                            
                            <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-accent/50">
                              <img src="https://cdn-icons-png.flaticon.com/512/6001/6001766.png" alt="Paytm" className="h-12 w-12 object-contain" />
                            </div>
                            
                            <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-accent/50">
                              <img src="https://cdn-icons-png.flaticon.com/512/1760/1760404.png" alt="PhonePe" className="h-12 w-12 object-contain" />
                            </div>
                            
                            <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-accent/50">
                              <img src="https://cdn-icons-png.flaticon.com/512/2763/2763184.png" alt="Card" className="h-12 w-12 object-contain" />
                            </div>
                            
                            <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-accent/50">
                              <img src="https://cdn-icons-png.flaticon.com/512/1968/1968667.png" alt="Cash" className="h-12 w-12 object-contain" />
                            </div>
                            
                            <div className="border rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-accent/50">
                              <img src="https://cdn-icons-png.flaticon.com/512/1019/1019607.png" alt="Online" className="h-12 w-12 object-contain" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </Form>
            </TabsContent>
            
            {/* Preview tab */}
            <TabsContent value="preview" className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Bill Preview</h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={printBill}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Bill
                  </Button>
                  <Button onClick={downloadBill}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
              
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div ref={billPreviewRef} className="bg-white p-8 rounded-lg shadow-sm max-w-3xl mx-auto print:shadow-none print:max-w-full">
                    <BillPreview 
                      formData={{
                        restaurantName: form.getValues().restaurantName || 'Restaurant Name',
                        address: form.getValues().address || 'Restaurant Address',
                        contactNumber: form.getValues().contactNumber || '0000000000',
                        gstNumber: form.getValues().gstNumber,
                        tableNo: form.getValues().tableNo,
                        orderNumber: form.getValues().orderNumber,
                        waiterName: form.getValues().waiterName,
                        billDate: form.getValues().billDate,
                        billTime: form.getValues().billTime,
                        invoiceNumber: form.getValues().invoiceNumber,
                        additionalCharges: form.getValues().additionalCharges,
                        taxPercentage: form.getValues().taxPercentage,
                      }}
                      logoPreview={logoPreview}
                      billItems={billItems}
                      subTotal={subTotal}
                      grandTotal={grandTotal}
                      template={selectedTemplate}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default RestaurantBill;
