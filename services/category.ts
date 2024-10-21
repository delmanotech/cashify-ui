import type { Category, CreateCategoryRequest } from "~/models/category";

export class CategoryService {
  static async fetchCategories(projectId: string): Promise<Category[]> {
    try {
      const { data, error } = await useApi<Category[]>(
        `/categories?projectId=${projectId}`
      );
      if (error) {
        throw new Error("Error fetching categories: " + error);
      }
      return data || [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  }

  static async fetchCategoryById(categoryId: string): Promise<Category> {
    try {
      const { data, error } = await useApi<Category>(
        `/api/categories/${categoryId}`
      );
      if (error) {
        throw new Error("Error fetching category: " + error);
      }
      return data!;
    } catch (error) {
      console.error("Failed to fetch category:", error);
      throw error;
    }
  }

  static async createCategory(
    category: CreateCategoryRequest
  ): Promise<Category> {
    try {
      const { data, error } = await useApi<Category>("/categories", {
        method: "POST",
        body: JSON.stringify(category),
      });
      if (error) {
        throw new Error("Error creating category: " + error);
      }
      return data!;
    } catch (error) {
      console.error("Failed to create category:", error);
      throw error;
    }
  }

  static async updateCategory(category: Category): Promise<Category> {
    try {
      const { data, error } = await useApi<Category>(
        `/categories/${category._id}`,
        {
          method: "PUT",
          body: JSON.stringify(category),
        }
      );
      if (error) {
        throw new Error("Error updating category: " + error);
      }
      return data!;
    } catch (error) {
      console.error("Failed to update category:", error);
      throw error;
    }
  }

  static async deleteCategory(categoryId: string): Promise<void> {
    try {
      const { error } = await useApi<void>(`/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (error) {
        throw new Error("Error deleting category: " + error);
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      throw error;
    }
  }
}
