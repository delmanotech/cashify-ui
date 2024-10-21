<template>
  <div class="transactions-page">
    <header class="transactions-header">
      <h2>Transactions</h2>
      <div v-if="selectedProjectId" class="header-action-btns">
        <VButton
          @click="openModal('income')"
          color="success"
          icon="lucide:trending-up"
          >Income</VButton
        >
        <VButton
          @click="openModal('expense')"
          color="danger"
          icon="lucide:trending-down"
          >Expense</VButton
        >
      </div>
      <div v-else class="header-action-btns">
        <p>Please select a project first.</p>
        <NuxtLink to="/projects" class="button is-link"
          >Go to Projects</NuxtLink
        >
      </div>
    </header>

    <div class="month-selector">
      <VIconButton @click="prevMonth" icon="lucide:chevron-left" />
      <span class="month-display">{{ formattedMonth }}</span>
      <VIconButton @click="nextMonth" icon="lucide:chevron-right" />
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="selectedProjectId">
      <VFlexTable :data="transactions" :columns="columns">
        <template #body-cell="{ row, column }">
          <VButtons v-if="column.key === 'actions'">
            <VIconButton @click="openModal(row.type, row)" icon="lucide:edit" />
            <VIconButton
              @click="deleteTransaction(row._id)"
              icon="lucide:trash"
            />
            <VButton v-if="!row.paid" @click="markAsPaid(row)" color="success"
              >Mark as Paid</VButton
            >
          </VButtons>
        </template>
      </VFlexTable>
    </div>
  </div>

  <!-- Modal for create/edit transaction -->
  <VModal
    :open="showModal"
    @close="closeModal"
    actions="right"
    :title="
      form?._id
        ? 'Edit Transaction'
        : `New ${
            transactionType.charAt(0).toUpperCase() + transactionType.slice(1)
          } Transaction`
    "
  >
    <template #content>
      <div class="modal-card" v-if="form">
        <section class="modal-card-body">
          <VField label="Description">
            <VControl>
              <VInput
                v-model="form.description"
                type="text"
                placeholder="Transaction Name"
              />
            </VControl>
          </VField>
          <VField label="Amount">
            <VControl>
              <VInput
                v-model="form.amount"
                type="number"
                placeholder="Transaction Amount"
              />
            </VControl>
          </VField>
          <VField label="Category">
            <VControl>
              <VSelect v-model="form.category" placeholder="Select Category">
                <VOption
                  v-for="category in filteredCategories"
                  :key="category._id"
                  :value="category._id"
                >
                  {{ category.name }}
                </VOption>
              </VSelect>
            </VControl>
          </VField>
          <VField label="Payment Date">
            <VControl>
              <VInput
                v-model="form.paymentDate"
                type="date"
                placeholder="Payment Date"
              />
            </VControl>
          </VField>
          <VField label="Paid">
            <VControl>
              <VSwitchBlock v-model="form.paid" />
            </VControl>
          </VField>
        </section>
      </div>
    </template>

    <template #action>
      <VButton @click="saveTransaction" color="primary">Save</VButton>
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { Transaction } from "~/models/transaction";
import { TransactionService } from "~/services/transaction";
import { CategoryService } from "~/services/category";
import { useProjectStore } from "~/stores/project";
import type { Category } from "~/models/category";
import { computed, ref, onMounted } from "vue";

const loading = ref(false);
const showModal = ref(false);
const form = ref();
const transactionType = ref<"income" | "expense" | "">("");
const projectStore = useProjectStore();
const transactions = ref<Transaction[]>([]);
const categories = ref<Category[]>([]);
const { selectedProjectId } = storeToRefs(projectStore);
const selectedMonth = ref(new Date());

const columns = {
  description: {
    label: "Description",
  },
  amount: {
    label: "Amount",
  },
  type: {
    label: "Type",
  },
  paymentDate: {
    label: "Payment Date",
  },
  actions: {
    label: "Actions",
  },
};

const loadTransactions = async () => {
  if (!selectedProjectId.value) return;
  loading.value = true;
  try {
    const startDate = new Date(
      selectedMonth.value.getFullYear(),
      selectedMonth.value.getMonth(),
      1
    )
      .toISOString()
      .split("T")[0];
    const endDate = new Date(
      selectedMonth.value.getFullYear(),
      selectedMonth.value.getMonth() + 1,
      0
    )
      .toISOString()
      .split("T")[0];

    const items = await TransactionService.fetchTransactions(
      selectedProjectId.value,
      {
        dateFrom: startDate,
        dateTo: endDate,
      }
    );
    transactions.value = items;
  } catch (error) {
    console.error("Error fetching transactions:", error);
  } finally {
    loading.value = false;
  }
};

const loadCategories = async () => {
  if (!selectedProjectId.value) return;
  try {
    const items = await CategoryService.fetchCategories(
      selectedProjectId.value
    );
    categories.value = items;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const filteredCategories = computed(() => {
  return categories.value.filter(
    (category) => category.type === transactionType.value
  );
});

const closeModal = () => {
  showModal.value = false;
  form.value = {
    description: "",
    amount: 0,
    category: "",
    paymentDate: "",
    paid: false,
  };
  transactionType.value = "";
};
const modalLoading = ref(false);

const saveTransaction = async () => {
  modalLoading.value = true;
  try {
    if (form.value.paid && new Date(form.value.paymentDate) > new Date()) {
      form.value.paymentDate = new Date().toISOString().split("T")[0];
    }
    if (form.value?._id) {
      await TransactionService.updateTransaction(form.value as Transaction);
    } else {
      await TransactionService.createTransaction({
        ...form.value,
        type: transactionType.value,
        project: selectedProjectId.value,
      } as Transaction);
    }
    await loadTransactions();
    closeModal();
  } catch (error) {
    console.error("Error saving transaction:", error);
  } finally {
    modalLoading.value = false;
  }
};

const openModal = (type: "income" | "expense", transaction?: Transaction) => {
  showModal.value = true;
  transactionType.value = type;
  if (transaction) {
    form.value = { ...transaction };
  } else {
    form.value = {
      description: "",
      amount: 0,
      category: "",
      paymentDate: "",
      paid: false,
    };
  }
};

const deleteTransaction = async (transactionId: string) => {
  try {
    await TransactionService.deleteTransaction(transactionId);
    await loadTransactions();
  } catch (error) {
    console.error("Error deleting transaction:", error);
  }
};

const markAsPaid = async (transaction: Transaction) => {
  try {
    if (new Date(transaction.paymentDate) > new Date()) {
      transaction.paymentDate = new Date();
    }
    transaction.paid = true;
    await TransactionService.updateTransaction(transaction);
    await loadTransactions();
  } catch (error) {
    console.error("Error marking transaction as paid:", error);
  }
};

const pageTitle = useState("page-title");

const prevMonth = () => {
  selectedMonth.value = new Date(
    selectedMonth.value.getFullYear(),
    selectedMonth.value.getMonth() - 1,
    1
  );
  loadTransactions();
};

const nextMonth = () => {
  selectedMonth.value = new Date(
    selectedMonth.value.getFullYear(),
    selectedMonth.value.getMonth() + 1,
    1
  );
  loadTransactions();
};

const formattedMonth = computed(() => {
  return selectedMonth.value.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
});

onMounted(async () => {
  if (selectedProjectId.value) {
    await loadTransactions();
    await loadCategories();
  }
  pageTitle.value = "Transactions";
});
</script>

<style scoped>
.transactions-page {
  padding: 20px;
}

.transactions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  font-size: 1.2em;
}

.header-action-btns {
  display: flex;
  gap: 10px;
}

.month-selector {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.2em;
}

.month-display {
  font-weight: bold;
}
</style>
