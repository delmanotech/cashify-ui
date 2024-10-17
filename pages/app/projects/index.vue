<template>
  <div class="projects-page">
    <header class="projects-header">
      <h2>Projects</h2>
      <VButton @click="showModal = true" color="primary">New Project</VButton>
    </header>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <VFlexTable :data="projects" :columns="columns">
        <template #actions="{ row }">
          <VButton @click="editProject(row)" color="warning">Edit</VButton>
          <VButton @click="deleteProject(row.id)" color="danger"
            >Delete</VButton
          >
        </template>
      </VFlexTable>
    </div>

    <!-- Modal for create/edit project -->
    <VModal
      :open="showModal"
      @close="closeModal"
      :title="form?._id ? 'Edit Project' : 'New Project'"
    >
      <template #content>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">
              {{ form?._id ? "Edit Project" : "New Project" }}
            </p>
          </header>
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
          <footer class="modal-card-foot">
            <VButton @click="saveProject" color="primary">Save</VButton>
            <VButton @click="closeModal">Cancel</VButton>
          </footer>
        </div>
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

onMounted(async () => {
  await loadProjects();
});

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
    if (projectStore.selectedProject) {
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

const editProject = (project: Project) => {
  form.value = { name: project.name, description: project.description };
  showModal.value = true;
};

const deleteProject = async (projectId: string) => {
  try {
    await ProjectService.deleteProject(projectId);
    await loadProjects();
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};
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
