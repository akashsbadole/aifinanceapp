import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  CreditCard as BusinessCard,
  Package,
  Boxes,
  Store,
  TrendingUp,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps & { onClick?: () => void }> = ({
  icon,
  label,
  to,
  onClick,
}) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center h-10 px-4 py-2 my-1 rounded-lg text-sm premium-transition group",
          isActive
            ? "bg-primary text-primary-foreground font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )
      }
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar = ({ className, isOpen, onClose }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass-effect border-r z-50",
        "overflow-y-auto py-6 px-3 flex flex-col transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}
    >
      <div className="mb-6 px-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Main Menu
        </h2>
      </div>

      <nav className="space-y-1 flex-1">
        <SidebarItem
          to="/dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          onClick={onClose}
        />

        {/* Inventory Section */}
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Inventory
          </h3>
          <div className="space-y-1">
            <SidebarItem
              to="/inventory/products"
              icon={<Boxes size={18} />}
              label="Product Management"
              onClick={onClose}
            />
            <SidebarItem
              to="/inventory/stock"
              icon={<Store size={18} />}
              label="Stock Management"
              onClick={onClose}
            />
            <SidebarItem
              to="/inventory/sales"
              icon={<ShoppingCart size={18} />}
              label="Sales Transactions"
              onClick={onClose}
            />
            <SidebarItem
              to="/pos"
              icon={<ShoppingCart size={18} />}
              label="POS"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Invoice Section */}
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Invoices
          </h3>
          <div className="space-y-1">
            <SidebarItem
              to="/invoices"
              icon={<FileText size={18} />}
              label="Invoices"
              onClick={onClose}
            />
            <SidebarItem
              to="/invoice-generator"
              icon={<FileText size={18} />}
              label="Invoice Generator"
              onClick={onClose}
            />
            <SidebarItem
              to="/proforma-invoice"
              icon={<FileSpreadsheet size={18} />}
              label="Proforma Invoice"
              onClick={onClose}
            />
            <SidebarItem
              to="/purchase-order"
              icon={<ShoppingCart size={18} />}
              label="Purchase Order"
              onClick={onClose}
            />
            <SidebarItem
              to="/cash-receipt"
              icon={<DollarSign size={18} />}
              label="Cash Receipt"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Tools Section */}
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Tools
          </h3>
          <div className="space-y-1">
            <SidebarItem
              to="/qr-code-generator"
              icon={<QrCode size={18} />}
              label="QR Code Generator"
              onClick={onClose}
            />
            <SidebarItem
              to="/estimate-quotation"
              icon={<FileCheck size={18} />}
              label="Estimate/Quotation"
              onClick={onClose}
            />
            <SidebarItem
              to="/restaurant-bill"
              icon={<Utensils size={18} />}
              label="Restaurant Bill"
              onClick={onClose}
            />
            <SidebarItem
              to="/barcode-generator"
              icon={<Barcode size={18} />}
              label="Barcode Generator"
              onClick={onClose}
            />
            <SidebarItem
              to="/business-card-maker"
              icon={<BusinessCard size={18} />}
              label="Business Card Maker"
              onClick={onClose}
            />
            <SidebarItem
              to="/calculators"
              icon={<Calculator size={18} />}
              label="Calculators"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Finance Section */}
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Finance
          </h3>
          <div className="space-y-1">
            <SidebarItem
              to="/expenses"
              icon={<CreditCard size={18} />}
              label="Expenses"
              onClick={onClose}
            />
            <SidebarItem
              to="/gst"
              icon={<Receipt size={18} />}
              label="GST Compliance"
              onClick={onClose}
            />
            <SidebarItem
              to="/gst-calculator"
              icon={<Calculator size={18} />}
              label="GST Calculator"
              onClick={onClose}
            />
            <SidebarItem
              to="/reports"
              icon={<BarChart4 size={18} />}
              label="Reports"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Market Data Section */}
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Market Data
          </h3>
          <div className="space-y-1">
            <SidebarItem
              to="/market-data"
              icon={<TrendingUp size={18} />}
              label="Stock Market"
              onClick={onClose}
            />
          </div>
        </div>
      </nav>

      <div className="mt-6 px-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Settings
        </h2>
      </div>

      <nav className="mt-1 mb-6">
        <SidebarItem
          to="/settings/profile"
          icon={<Users size={18} />}
          label="Business Profile"
          onClick={onClose}
        />
        <SidebarItem
          to="/settings/general"
          icon={<Settings size={18} />}
          label="Preferences"
          onClick={onClose}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
