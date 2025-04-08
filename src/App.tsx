import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Expenses from "./pages/Expenses";
import GSTCompliance from "./pages/GSTCompliance";
import Reports from "./pages/Reports";
import RestaurantBill from "./pages/RestaurantBill";
import GSTCalculator from "./pages/GSTCalculator";
import NotFound from "./pages/NotFound";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import EstimateQuotation from "./pages/estimateQuotation";
import ProformaInvoice from "./pages/ProformaInvoice";
import PurchaseOrder from "./pages/PurchaseOrder";
import CashReceipt from "./pages/CashReceipt";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import BarcodeGenerator from "./pages/BarcodeGenerator";
import BusinessCardMaker from "./pages/BusinessCardMaker";
import ExpenseManagement from "@/components/expenses/ExpenseManagement";
import ProductManagement from "@/pages/inventory/ProductManagement";
import StockManagement from "@/pages/inventory/StockManagement";
import SalesTransactions from "@/pages/inventory/SalesTransactions";
import POS from "./pages/POS";
import EMICalculator from "@/components/calculators/EMICalculator";
import SIPCalculator from "@/components/calculators/SIPCalculator";
import FDCalculator from "@/components/calculators/FDCalculator";
import MarginCalculator from "@/components/calculators/MarginCalculator";
import PPFCalculator from "@/components/calculators/PPFCalculator";
import RDCalculator from "@/components/calculators/RDCalculator";
import SSYCalculator from "@/components/calculators/SSYCalculator";
import SWPCalculator from "@/components/calculators/SWPCalculator";
import MutualFundCalculator from "@/components/calculators/MutualFundCalculator";
import BrokerageCalculator from "@/components/calculators/BrokerageCalculator";
import CalculatorLanding from "./pages/CalculatorLanding";
import Companies from "./pages/Companies";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calculators" element={<CalculatorLanding />} />

            {/* Calculator Routes */}
            <Route path="/calculators/emi" element={<EMICalculator />} />
            <Route path="/calculators/sip" element={<SIPCalculator />} />
            <Route path="/calculators/fd" element={<FDCalculator />} />
            <Route path="/calculators/margin" element={<MarginCalculator />} />
            <Route path="/calculators/ppf" element={<PPFCalculator />} />
            <Route path="/calculators/rd" element={<RDCalculator />} />
            <Route path="/calculators/ssy" element={<SSYCalculator />} />
            <Route path="/calculators/swp" element={<SWPCalculator />} />
            <Route
              path="/calculators/mutual-fund"
              element={<MutualFundCalculator />}
            />
            <Route
              path="/calculators/brokerage"
              element={<BrokerageCalculator />}
            />

            {/* Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/invoices"
              element={
                <DashboardLayout>
                  <Invoices />
                </DashboardLayout>
              }
            />
            <Route
              path="/expenses"
              element={
                <DashboardLayout>
                  <ExpenseManagement />
                </DashboardLayout>
              }
            />
            <Route
              path="/gst"
              element={
                <DashboardLayout>
                  <GSTCompliance />
                </DashboardLayout>
              }
            />
            <Route
              path="/reports"
              element={
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              }
            />
            <Route
              path="/restaurant-bill"
              element={
                <DashboardLayout>
                  <RestaurantBill />
                </DashboardLayout>
              }
            />
            <Route
              path="/gst-calculator"
              element={
                <DashboardLayout>
                  <GSTCalculator />
                </DashboardLayout>
              }
            />
            <Route
              path="/invoice-generator"
              element={
                <DashboardLayout>
                  <InvoiceGenerator />
                </DashboardLayout>
              }
            />
            <Route
              path="/estimate-quotation"
              element={
                <DashboardLayout>
                  <EstimateQuotation />
                </DashboardLayout>
              }
            />
            <Route
              path="/proforma-invoice"
              element={
                <DashboardLayout>
                  <ProformaInvoice />
                </DashboardLayout>
              }
            />
            <Route
              path="/purchase-order"
              element={
                <DashboardLayout>
                  <PurchaseOrder />
                </DashboardLayout>
              }
            />
            <Route
              path="/cash-receipt"
              element={
                <DashboardLayout>
                  <CashReceipt />
                </DashboardLayout>
              }
            />
            <Route
              path="/qr-code-generator"
              element={
                <DashboardLayout>
                  <QRCodeGenerator />
                </DashboardLayout>
              }
            />
            <Route
              path="/barcode-generator"
              element={
                <DashboardLayout>
                  <BarcodeGenerator />
                </DashboardLayout>
              }
            />
            <Route
              path="/business-card-maker"
              element={
                <DashboardLayout>
                  <BusinessCardMaker />
                </DashboardLayout>
              }
            />
            <Route
              path="/inventory/products"
              element={
                <DashboardLayout>
                  <ProductManagement />
                </DashboardLayout>
              }
            />
            <Route
              path="/inventory/stock"
              element={
                <DashboardLayout>
                  <StockManagement />
                </DashboardLayout>
              }
            />
            <Route
              path="/inventory/sales"
              element={
                <DashboardLayout>
                  <SalesTransactions />
                </DashboardLayout>
              }
            />
            <Route
              path="/pos"
              element={
                <DashboardLayout>
                  <POS />
                </DashboardLayout>
              }
            />
            <Route
              path="/market-data"
              element={
                <DashboardLayout>
                  <Companies />
                </DashboardLayout>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
