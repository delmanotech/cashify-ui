<template>
  <div class="projects-page">
    <header class="projects-header">
      <h2>Projects</h2>
      <VButton @click="openModal" color="primary">New Project</VButton>
    </header>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <VFlexTable :data="projects" :columns="columns">
        <template #body-cell="{ row, column }">
          <VButtons v-if="column.key === 'actions'">
            <VIconButton @click="openModal(row)" icon="lucide:edit" />
            <VIconButton @click="deleteProject(row._id)" icon="lucide:trash" />

            <VButton
              v-if="selectedProjectId !== row._id"
              @click="handleSelectProject(row)"
            >
              Set as Active
            </VButton>

            <VButton v-else color="primary">Active</VButton>
          </VButtons>
        </template>
      </VFlexTable>
    </div>

    <!-- Modal for create/edit project -->
    <VModal
      :open="showModal"
      @close="closeModal"
      actions="right"
      :title="form?._id ? 'Edit Project' : 'New Project'"
    >
      <template #content>
        <div class="modal-card" v-if="form">
          <section class="modal-card-body">
            <VField label="Name">
              <VControl>
                <VInput
                  v-model="form.name"
                  type="text"
                  placeholder="Project Name"
                />
              </VControl>
            </VField>
            <VField label="Description">
              <VControl>
                <VInput
                  v-model="form.description"
                  type="text"
                  placeholder="Project Description"
                />
              </VControl>
            </VField>
          </section>
        </div>
      </template>

      <template #action>
        <VButton @click="saveProject" color="primary">Save</VButton>
      </template>
    </VModal>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { Project } from "~/models/project";
import { ProjectService } from "~/services/project";
import { useProjectStore } from "~/stores/project";

const loading = ref(false);
const showModal = ref(false);
const form = ref();
const projectStore = useProjectStore();
const { projects, selectedProjectId } = storeToRefs(projectStore);

const columns = {
  name: {
    label: "Name",
  },
  description: {
    label: "Description",
  },
  actions: {
    label: "Actions",
  },
};

const loadProjects = async () => {
  loading.value = true;
  try {
    const items = await ProjectService.fetchProjects();

    projectStore.setProjects(items);
  } catch (error) {
    console.error("Error fetching projects:", error);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;

  form.value = { name: "", description: "" };
};

const saveProject = async () => {
  try {
    if (form.value?._id) {
      await ProjectService.updateProject(form.value as Project);
    } else {
      await ProjectService.createProject(form.value as Project);
    }
    await loadProjects();
    closeModal();
  } catch (error) {
    console.error("Error saving project:", error);
  }
};

const openModal = (project?: Project) => {
  showModal.value = true;

  if (project) {
    form.value = { ...project };
  } else {
    form.value = { name: "", description: "" };
  }
};

const deleteProject = async (projectId: string) => {
  try {
    await ProjectService.deleteProject(projectId);
    await loadProjects();
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};

const handleSelectProject = (project: Project) => {
  projectStore.setSelectedProject(project._id);
};

const pageTitle = useState("page-title");

onMounted(async () => {
  await loadProjects();

  pageTitle.value = "Projects";
});
</script>

<style scoped>
.projects-page {
  padding: 20px;
}

.projects-header {
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
