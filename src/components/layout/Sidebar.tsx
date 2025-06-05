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
  Calculator,
  ShoppingCart,
  QrCode,
  Package,
  TrendingUp,
  Home,
  Briefcase,
  Wrench,
  DollarSign,
  ChevronRight,
  FileCheck,
  Utensils,
  Barcode,
  CreditCard as BusinessCard,
  FileSpreadsheet,
  Boxes,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  to,
  isCollapsed,
  onClick,
}) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
          isActive
            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          isCollapsed && "justify-center px-2"
        )
      }
    >
      <span className={cn("flex-shrink-0", isCollapsed ? "text-lg" : "")}>
        {icon}
      </span>
      {!isCollapsed && <span className="truncate">{label}</span>}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </NavLink>
  );
};

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isCollapsed?: boolean;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  icon,
  children,
  isCollapsed,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  if (isCollapsed) {
    return (
      <div className="space-y-1">
        <div className="flex justify-center py-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
            {icon}
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between px-3 py-2 h-auto text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-transparent"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        <ChevronRight
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            isExpanded && "rotate-90"
          )}
        />
      </Button>
      {isExpanded && <div className="space-y-1 pl-2">{children}</div>}
    </div>
  );
};

const Sidebar = ({
  className,
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300",
        "overflow-y-auto flex flex-col",
        isCollapsed ? "w-16" : "w-64",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}
    >
      {/* Logo/Brand */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-4 border-b border-gray-200",
          isCollapsed && "justify-center px-2"
        )}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        {!isCollapsed && (
          <span className="font-bold text-lg text-gray-900">Finance App</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {/* Main */}
        <div className="space-y-1">
          <SidebarItem
            to="/dashboard"
            icon={<Home size={18} />}
            label="Dashboard"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
        </div>

        {/* Inventory Section */}
        <SidebarSection
          title="Inventory"
          icon={<Package size={14} />}
          isCollapsed={isCollapsed}
        >
          <SidebarItem
            to="/inventory/products"
            icon={<Package size={16} />}
            label="Products"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/inventory/stock"
            icon={<BarChart4 size={16} />}
            label="Stock"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/inventory/sales"
            icon={<ShoppingCart size={16} />}
            label="Sales"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/pos"
            icon={<ShoppingCart size={16} />}
            label="POS"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
        </SidebarSection>

        {/* Invoices Section */}
        <SidebarSection
          title="Invoices"
          icon={<FileText size={14} />}
          isCollapsed={isCollapsed}
        >
          <SidebarItem
            to="/invoices"
            icon={<FileText size={16} />}
            label="All Invoices"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/invoice-generator"
            icon={<FileText size={16} />}
            label="Create Invoice"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/proforma-invoice"
            icon={<FileSpreadsheet size={16} />}
            label="Proforma"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/purchase-order"
            icon={<ShoppingCart size={16} />}
            label="Purchase Order"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/cash-receipt"
            icon={<DollarSign size={16} />}
            label="Cash Receipt"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
        </SidebarSection>

        {/* Tools Section */}
        <SidebarSection
          title="Tools"
          icon={<Wrench size={14} />}
          isCollapsed={isCollapsed}
        >
          <SidebarItem
            to="/qr-code-generator"
            icon={<QrCode size={16} />}
            label="QR Generator"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/barcode-generator"
            icon={<Barcode size={16} />}
            label="Barcode"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/business-card-maker"
            icon={<BusinessCard size={16} />}
            label="Business Card"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/calculators"
            icon={<Calculator size={16} />}
            label="Calculators"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
        </SidebarSection>

        {/* Finance Section */}
        <SidebarSection
          title="Finance"
          icon={<DollarSign size={14} />}
          isCollapsed={isCollapsed}
        >
          <SidebarItem
            to="/expenses"
            icon={<CreditCard size={16} />}
            label="Expenses"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/gst"
            icon={<Receipt size={16} />}
            label="GST"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/gst-calculator"
            icon={<Calculator size={16} />}
            label="GST Calculator"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/reports"
            icon={<BarChart4 size={16} />}
            label="Reports"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
        </SidebarSection>

        {/* Market Data Section */}
        <SidebarSection
          title="Market Data"
          icon={<TrendingUp size={14} />}
          isCollapsed={isCollapsed}
        >
          <SidebarItem
            to="/market-data"
            icon={<TrendingUp size={16} />}
            label="Stock Market"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
        </SidebarSection>
        {/* Settings Section */}
        <SidebarSection
          title="Settings"
          icon={<Settings size={14} />}
          isCollapsed={isCollapsed}
        >
          <SidebarItem
            to="/settings/profile"
            icon={<Users size={16} />}
            label="Business Profile"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
          <SidebarItem
            to="/settings/general"
            icon={<Settings size={16} />}
            label="Preferences"
            isCollapsed={isCollapsed}
            onClick={onClose}
          />
        </SidebarSection>
      </nav>
    </aside>
  );
};

export default Sidebar;
