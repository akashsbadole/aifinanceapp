import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  BarChart4, 
  Receipt, 
  Users, 
  Settings,
  Utensils,
  Calculator,
  FileCheck,
  FileSpreadsheet,
  ShoppingCart,
  DollarSign,
  QrCode,
  Barcode,
  CreditCard as BusinessCard
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to }) => {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => cn(
        "flex items-center h-10 px-4 py-2 my-1 rounded-lg text-sm premium-transition group",
        isActive 
          ? "bg-primary text-primary-foreground font-medium" 
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar = ({ className }: SidebarProps) => {
  return (
    <aside className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass-effect border-r",
      "overflow-y-auto py-6 px-3 flex flex-col",
      className
    )}>
      <div className="mb-6 px-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Main Menu
        </h2>
      </div>
      
      <nav className="space-y-1 flex-1">
        <SidebarItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <SidebarItem to="/invoices" icon={<FileText size={18} />} label="Invoices" />
        <SidebarItem to="/expenses" icon={<CreditCard size={18} />} label="Expenses" />
        <SidebarItem to="/invoice-generator" icon={<FileText size={18} />} label="Invoice Generator" />
        <SidebarItem to="/proforma-invoice" icon={<FileSpreadsheet size={18} />} label="Proforma Invoice" />
        <SidebarItem to="/purchase-order" icon={<ShoppingCart size={18} />} label="Purchase Order" />
        <SidebarItem to="/cash-receipt" icon={<DollarSign size={18} />} label="Cash Receipt" />
        <SidebarItem to="/qr-code-generator" icon={<QrCode size={18} />} label="QR Code Generator" />
        <SidebarItem to="/estimate-quotation" icon={<FileCheck size={18} />} label="Estimate/Quotation" />
        <SidebarItem to="/restaurant-bill" icon={<Utensils size={18} />} label="Restaurant Bill" />
        <SidebarItem to="/gst" icon={<Receipt size={18} />} label="GST Compliance" />
        <SidebarItem to="/gst-calculator" icon={<Calculator size={18} />} label="GST Calculator" />
        <SidebarItem to="/reports" icon={<BarChart4 size={18} />} label="Reports" />
        <SidebarItem to="/barcode-generator" icon={<Barcode size={18} />} label="Barcode Generator" />
        <SidebarItem 
          to="/business-card-maker" 
          icon={<BusinessCard size={18} />} 
          label="Business Card Maker" 
        />
      </nav>
      
      <div className="mt-6 px-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Settings
        </h2>
      </div>
      
      <nav className="mt-1 mb-6">
        <SidebarItem to="/settings/profile" icon={<Users size={18} />} label="Business Profile" />
        <SidebarItem to="/settings/general" icon={<Settings size={18} />} label="Preferences" />
      </nav>
    </aside>
  );
};

export default Sidebar;
