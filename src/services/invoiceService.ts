const API_BASE_URL = "http://localhost:3001/api";

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id?: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  date: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  notes?: string;
  terms?: string;
  items: InvoiceItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceStats {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class InvoiceService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get all invoices with filtering and pagination
  async getInvoices(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<InvoiceListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.status) searchParams.append("status", params.status);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    return this.request<InvoiceListResponse>(
      `/invoices${query ? `?${query}` : ""}`
    );
  }

  // Get single invoice by ID
  async getInvoiceById(id: string): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${id}`);
  }

  // Create new invoice
  async createInvoice(
    invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">
  ): Promise<Invoice> {
    return this.request<Invoice>("/invoices", {
      method: "POST",
      body: JSON.stringify(invoice),
    });
  }

  // Update invoice
  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(invoice),
    });
  }

  // Update invoice status only
  async updateInvoiceStatus(
    id: string,
    status: Invoice["status"]
  ): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Delete invoice
  async deleteInvoice(id: string): Promise<void> {
    await this.request<void>(`/invoices/${id}`, {
      method: "DELETE",
    });
  }

  // Get invoice statistics
  async getInvoiceStats(): Promise<InvoiceStats> {
    return this.request<InvoiceStats>("/invoices/stats");
  }

  // Generate invoice number
  generateInvoiceNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const timestamp = now.getTime().toString().slice(-6);
    return `INV-${year}${month}-${timestamp}`;
  }

  // Calculate invoice totals
  calculateTotals(
    items: InvoiceItem[],
    taxRate: number = 18,
    discount: number = 0
  ) {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const total = taxableAmount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
    };
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  }

  // Get status color
  getStatusColor(status: Invoice["status"]): string {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  // Check if invoice is overdue
  isOverdue(invoice: Invoice): boolean {
    if (invoice.status === "paid" || invoice.status === "cancelled") {
      return false;
    }

    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return dueDate < today;
  }

  // Get days until due or overdue
  getDaysUntilDue(invoice: Invoice): number {
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Export invoice data
  exportToCSV(invoices: Invoice[]): string {
    const headers = [
      "Invoice Number",
      "Client Name",
      "Date",
      "Due Date",
      "Status",
      "Subtotal",
      "Tax Amount",
      "Total",
    ];

    const rows = invoices.map((invoice) => [
      invoice.invoiceNumber,
      invoice.clientName,
      new Date(invoice.date).toLocaleDateString(),
      new Date(invoice.dueDate).toLocaleDateString(),
      invoice.status,
      invoice.subtotal.toString(),
      invoice.taxAmount.toString(),
      invoice.total.toString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    return csvContent;
  }

  // Download CSV
  downloadCSV(invoices: Invoice[], filename: string = "invoices.csv"): void {
    const csvContent = this.exportToCSV(invoices);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export const invoiceService = new InvoiceService();
