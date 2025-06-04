import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Send,
  Copy,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  invoiceService,
  Invoice,
  InvoiceStats,
} from "@/services/invoiceService";
import { Loader2, AlertCircle, CheckCircle, Clock } from "lucide-react";

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Fetch invoices from API
  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await invoiceService.getInvoices({
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchQuery || undefined,
        page: currentPage,
        limit: 10,
      });

      setInvoices(response.invoices);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch invoices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch invoice statistics
  const fetchStats = async () => {
    try {
      const statsData = await invoiceService.getInvoiceStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch invoice stats:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter, searchQuery, currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchInvoices();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    return invoiceService.getStatusColor(status as Invoice["status"]);
  };

  const handleAction = async (action: string, invoice: Invoice) => {
    try {
      switch (action) {
        case "Delete":
          if (
            window.confirm(
              `Are you sure you want to delete invoice ${invoice.invoiceNumber}?`
            )
          ) {
            await invoiceService.deleteInvoice(invoice.id!);
            toast({
              title: "Invoice Deleted",
              description: `Invoice ${invoice.invoiceNumber} has been deleted`,
            });
            fetchInvoices();
            fetchStats();
          }
          break;
        case "Duplicate":
          const duplicateData = {
            ...invoice,
            invoiceNumber: invoiceService.generateInvoiceNumber(),
            status: "draft" as const,
            date: new Date().toISOString().split("T")[0],
          };
          delete duplicateData.id;
          delete duplicateData.createdAt;
          delete duplicateData.updatedAt;

          await invoiceService.createInvoice(duplicateData);
          toast({
            title: "Invoice Duplicated",
            description: `New invoice ${duplicateData.invoiceNumber} created`,
          });
          fetchInvoices();
          fetchStats();
          break;
        case "Download":
          // Export single invoice to CSV
          invoiceService.downloadCSV(
            [invoice],
            `invoice-${invoice.invoiceNumber}.csv`
          );
          toast({
            title: "Invoice Downloaded",
            description: `Invoice ${invoice.invoiceNumber} has been downloaded`,
          });
          break;
        default:
          toast({
            title: `${action} Invoice`,
            description: `${action} ${invoice.invoiceNumber} for ${invoice.clientName}`,
          });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} invoice`,
        variant: "destructive",
      });
    }
  };

  const handleExportAll = () => {
    if (invoices.length === 0) {
      toast({
        title: "No Data",
        description: "No invoices to export",
        variant: "destructive",
      });
      return;
    }

    invoiceService.downloadCSV(invoices, "all-invoices.csv");
    toast({
      title: "Export Complete",
      description: `${invoices.length} invoices exported successfully`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">
            Manage your invoices and billing
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-xl font-bold">{stats?.totalInvoices || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-xl font-bold text-green-600">
                  {invoiceService.formatCurrency(stats?.paidAmount || 0)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-yellow-600">
                  {invoiceService.formatCurrency(stats?.pendingAmount || 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl font-bold text-blue-600">
                  {invoiceService.formatCurrency(stats?.totalAmount || 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleExportAll}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <Card className="hidden lg:block">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading invoices...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-12 w-12 text-muted-foreground/50" />
                        <p className="text-muted-foreground">
                          No invoices found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{invoice.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.clientEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {invoiceService.formatCurrency(invoice.total)}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleAction("View", invoice)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("Edit", invoice)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("Send", invoice)}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("Duplicate", invoice)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("Download", invoice)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("Delete", invoice)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading invoices...</span>
          </div>
        ) : invoices.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No invoices found</p>
            </CardContent>
          </Card>
        ) : (
          invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.clientName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadge(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleAction("View", invoice)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("Edit", invoice)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("Duplicate", invoice)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("Delete", invoice)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Amount:
                    </span>
                    <span className="font-semibold">
                      {invoiceService.formatCurrency(invoice.total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <span className="text-sm">
                      {new Date(invoice.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Due Date:
                    </span>
                    <span className="text-sm">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Invoices;
