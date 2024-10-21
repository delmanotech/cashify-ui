export interface Transaction {
  _id: string;
  amount: number;
  description: string;
  type: "income" | "expense";
  paid: boolean;
  paymentDate: Date;
  category: string;
  project: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionRequest {
  amount: number;
  description: string;
  type: "income" | "expense";
  paid: boolean;
  paymentDate: Date;
  category: string;
  project: string;
}
