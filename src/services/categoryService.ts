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

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  },

  async createCategory(
    data: Omit<Category, "id" | "_count">
  ): Promise<Category> {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create category");
    }
    return response.json();
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update category");
    }
    return response.json();
  },

  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete category");
    }
  },
};
