<template>
  <div class="categories-page">
    <header class="categories-header">
      <h2>Categories</h2>
      <VButton v-if="selectedProjectId" @click="openModal" color="primary"
        >New Category</VButton
      >
      <div v-else>
        <p>Please select a project first.</p>
        <NuxtLink to="/projects" class="button is-link"
          >Go to Projects</NuxtLink
        >
      </div>
    </header>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="selectedProjectId">
      <VFlexTable :data="categories" :columns="columns">
        <template #body-cell="{ row, column }">
          <VButtons v-if="column.key === 'actions'">
            <VIconButton @click="openModal(row)" icon="lucide:edit" />
            <VIconButton @click="deleteCategory(row._id)" icon="lucide:trash" />
          </VButtons>
        </template>
      </VFlexTable>
    </div>
  </div>

  <!-- Modal for create/edit category -->
  <VModal
    :open="showModal"
    @close="closeModal"
    actions="right"
    :title="form?._id ? 'Edit Category' : 'New Category'"
  >
    <template #content>
      <div class="modal-card" v-if="form">
        <section class="modal-card-body">
          <VField label="Name">
            <VControl>
              <VInput
                v-model="form.name"
                type="text"
                placeholder="Category Name"
              />
            </VControl>
          </VField>
          <VField label="Type">
            <VControl>
              <VSelect v-model="form.type" placeholder="Select Category Type">
                <VOption value="income">Income</VOption>
                <VOption value="expense">Expense</VOption>
              </VSelect>
            </VControl>
          </VField>
        </section>
      </div>
    </template>

    <template #action>
      <VButton @click="saveCategory" color="primary">Save</VButton>
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { Category } from "~/models/category";
import { CategoryService } from "~/services/category";
import { useProjectStore } from "~/stores/project";

const loading = ref(false);
const showModal = ref(false);
const form = ref();
const projectStore = useProjectStore();
const categories = ref<Category[]>([]);
const { selectedProjectId } = storeToRefs(projectStore);

const columns = {
  name: {
    label: "Name",
  },
  type: {
    label: "Type",
  },
  actions: {
    label: "Actions",
  },
};

const loadCategories = async () => {
  if (!selectedProjectId.value) return;
  loading.value = true;
  try {
    const items = await CategoryService.fetchCategories(
      selectedProjectId.value
    );

    categories.value = items;
  } catch (error) {
    console.error("Error fetching categories:", error);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
  form.value = { name: "", type: "income" };
};
const modalLoading = ref(false);

const saveCategory = async () => {
  modalLoading.value = true;

  try {
    if (form.value?._id) {
      await CategoryService.updateCategory(form.value as Category);
    } else {
      await CategoryService.createCategory({
        ...form.value,
        project: selectedProjectId.value,
      } as Category);
    }
    await loadCategories();
    closeModal();
  } catch (error) {
    console.error("Error saving category:", error);
  } finally {
    modalLoading.value = false;
  }
};

const openModal = (category?: Category) => {
  showModal.value = true;
  if (category) {
    form.value = { ...category };
  } else {
    form.value = { name: "", type: "income" };
  }
};

const deleteCategory = async (categoryId: string) => {
  try {
    await CategoryService.deleteCategory(categoryId);
    await loadCategories();
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

const pageTitle = useState("page-title");

onMounted(async () => {
  if (selectedProjectId.value) {
    await loadCategories();
  }
  pageTitle.value = "Categories";
});
</script>

<style scoped>
.categories-page {
  padding: 20px;
}

.categories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  font-size: 1.2em;
}
</style>
