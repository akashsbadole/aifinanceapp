import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  clientAddress: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface BusinessProfile {
  id: string;
  companyName: string;
  companyAddress: string;
  phone?: string;
  email?: string;
  website?: string;
  gstin?: string;
  logo?: string;
  isDefault: boolean;
}

export interface QRCode {
  id: string;
  name: string;
  content: string;
  type: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';
  qrCodeData: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  vendor?: string;
  date: string;
  paymentMethod?: string;
  status: 'pending' | 'approved' | 'rejected';
  hasReceipt: boolean;
  receiptUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  categoryId: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minimumStock: number;
  location?: string;
}

// Store interface
interface AppStore {
  // Invoices
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  setCurrentInvoice: (invoice: Invoice | null) => void;
  
  // Business Profiles
  businessProfiles: BusinessProfile[];
  currentProfile: BusinessProfile | null;
  addBusinessProfile: (profile: Omit<BusinessProfile, 'id'>) => void;
  updateBusinessProfile: (id: string, profile: Partial<BusinessProfile>) => void;
  deleteBusinessProfile: (id: string) => void;
  setCurrentProfile: (profile: BusinessProfile | null) => void;
  
  // QR Codes
  qrCodes: QRCode[];
  addQRCode: (qrCode: Omit<QRCode, 'id' | 'createdAt'>) => void;
  updateQRCode: (id: string, qrCode: Partial<QRCode>) => void;
  deleteQRCode: (id: string) => void;
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // UI State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Settings
  settings: {
    currency: string;
    taxRate: number;
    companyName: string;
    theme: 'light' | 'dark';
  };
  updateSettings: (settings: Partial<AppStore['settings']>) => void;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Create store
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      invoices: [],
      currentInvoice: null,
      businessProfiles: [],
      currentProfile: null,
      qrCodes: [],
      expenses: [],
      products: [],
      sidebarCollapsed: false,
      settings: {
        currency: 'INR',
        taxRate: 18,
        companyName: '',
        theme: 'light',
      },

      // Invoice actions
      addInvoice: (invoice) => set((state) => ({
        invoices: [...state.invoices, {
          ...invoice,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]
      })),

      updateInvoice: (id, invoice) => set((state) => ({
        invoices: state.invoices.map(inv => 
          inv.id === id ? { ...inv, ...invoice, updatedAt: new Date().toISOString() } : inv
        )
      })),

      deleteInvoice: (id) => set((state) => ({
        invoices: state.invoices.filter(inv => inv.id !== id)
      })),

      setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),

      // Business Profile actions
      addBusinessProfile: (profile) => set((state) => ({
        businessProfiles: [...state.businessProfiles, { ...profile, id: generateId() }]
      })),

      updateBusinessProfile: (id, profile) => set((state) => ({
        businessProfiles: state.businessProfiles.map(prof => 
          prof.id === id ? { ...prof, ...profile } : prof
        )
      })),

      deleteBusinessProfile: (id) => set((state) => ({
        businessProfiles: state.businessProfiles.filter(prof => prof.id !== id)
      })),

      setCurrentProfile: (profile) => set({ currentProfile: profile }),

      // QR Code actions
      addQRCode: (qrCode) => set((state) => ({
        qrCodes: [...state.qrCodes, {
          ...qrCode,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }]
      })),

      updateQRCode: (id, qrCode) => set((state) => ({
        qrCodes: state.qrCodes.map(qr => 
          qr.id === id ? { ...qr, ...qrCode } : qr
        )
      })),

      deleteQRCode: (id) => set((state) => ({
        qrCodes: state.qrCodes.filter(qr => qr.id !== id)
      })),

      // Expense actions
      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: generateId() }]
      })),

      updateExpense: (id, expense) => set((state) => ({
        expenses: state.expenses.map(exp => 
          exp.id === id ? { ...exp, ...expense } : exp
        )
      })),

      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(exp => exp.id !== id)
      })),

      // Product actions
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: generateId() }]
      })),

      updateProduct: (id, product) => set((state) => ({
        products: state.products.map(prod => 
          prod.id === id ? { ...prod, ...product } : prod
        )
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(prod => prod.id !== id)
      })),

      // UI actions
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Settings actions
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: 'finance-app-storage',
      partialize: (state) => ({
        invoices: state.invoices,
        businessProfiles: state.businessProfiles,
        qrCodes: state.qrCodes,
        expenses: state.expenses,
        products: state.products,
        settings: state.settings,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
