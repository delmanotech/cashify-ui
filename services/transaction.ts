import type {
  CreateTransactionRequest,
  Transaction,
} from "~/models/transaction";

export class TransactionService {
  static async fetchTransactions(
    projectId: string,
    queryParams: any
  ): Promise<Transaction[]> {
    try {
      const query = new URLSearchParams(queryParams).toString();

      const { data, error } = await useApi<Transaction[]>(
        `/transactions?projectId=${projectId}&${query}`
      );
      if (error) {
        throw new Error("Error fetching transactions: " + error);
      }
      return data || [];
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      throw error;
    }
  }

  static async fetchTransactionById(
    transactionId: string
  ): Promise<Transaction> {
    try {
      const { data, error } = await useApi<Transaction>(
        `/api/transactions/${transactionId}`
      );
      if (error) {
        throw new Error("Error fetching transaction: " + error);
      }
      return data!;
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
      throw error;
    }
  }

  static async createTransaction(
    transaction: CreateTransactionRequest
  ): Promise<Transaction> {
    try {
      const { data, error } = await useApi<Transaction>("/transactions", {
        method: "POST",
        body: JSON.stringify(transaction),
      });
      if (error) {
        throw new Error("Error creating transaction: " + error);
      }
      return data!;
    } catch (error) {
      console.error("Failed to create transaction:", error);
      throw error;
    }
  }

  static async updateTransaction(
    transaction: Transaction
  ): Promise<Transaction> {
    try {
      const { data, error } = await useApi<Transaction>(
        `/transactions/${transaction._id}`,
        {
          method: "PUT",
          body: JSON.stringify(transaction),
        }
      );
      if (error) {
        throw new Error("Error updating transaction: " + error);
      }
      return data!;
    } catch (error) {
      console.error("Failed to update transaction:", error);
      throw error;
    }
  }

  static async deleteTransaction(transactionId: string): Promise<void> {
    try {
      const { error } = await useApi<void>(`/transactions/${transactionId}`, {
        method: "DELETE",
      });
      if (error) {
        throw new Error("Error deleting transaction: " + error);
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      throw error;
    }
  }
}
