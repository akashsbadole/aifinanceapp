const API_URL = "http://localhost:3002/api";

export interface Category {
  id: string;
  name: string;
  description?: string;
  budget?: number;
  _count?: {
    expenses: number;
  };
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  category: Category;
  date: string;
  vendor?: string;
  description?: string;
  paymentMethod?: string;
  hasReceipt: boolean;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ExpenseSummary {
  total: number;
  byCategory: { categoryId: string; total: number }[];
  byPaymentMethod: { method: string; total: number }[];
}

export const expenseService = {
  async getAllExpenses(filters: ExpenseFilters = {}): Promise<{
    expenses: Expense[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);
    if (filters.categoryId)
      queryParams.append("categoryId", filters.categoryId);
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.limit) queryParams.append("limit", filters.limit.toString());

    const response = await fetch(`${API_URL}/expenses?${queryParams}`);
    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }
    return response.json();
  },

  async createExpense(
    expense: Omit<Expense, "id" | "createdAt" | "updatedAt" | "category">
  ): Promise<Expense> {
    const response = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    });
    if (!response.ok) {
      throw new Error("Failed to create expense");
    }
    return response.json();
  },

  async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    });
    if (!response.ok) {
      throw new Error("Failed to update expense");
    }
    return response.json();
  },

  async deleteExpense(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete expense");
    }
  },

  async getExpenseSummary(
    filters: ExpenseFilters = {}
  ): Promise<ExpenseSummary> {
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);
    if (filters.categoryId)
      queryParams.append("categoryId", filters.categoryId);

    const response = await fetch(`${API_URL}/expenses/summary?${queryParams}`);
    if (!response.ok) {
      throw new Error("Failed to fetch expense summary");
    }
    return response.json();
  },

  async exportExpenses(filters: ExpenseFilters = {}): Promise<Expense[]> {
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);
    if (filters.categoryId)
      queryParams.append("categoryId", filters.categoryId);

    const response = await fetch(`${API_URL}/expenses/export?${queryParams}`);
    if (!response.ok) {
      throw new Error("Failed to export expenses");
    }
    return response.json();
  },
};
