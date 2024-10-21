export interface Category {
  _id: string;
  name: string;
  type: "income" | "expense";
  project: string;
  createdBy: string;
}

export interface CreateCategoryRequest {
  name: string;
  type: "income" | "expense";
  project: string;
}
