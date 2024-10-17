import { defineStore } from "pinia";
import type { Project, ProjectStoreState } from "~/models/project";

export const useProjectStore = defineStore("project", {
  state: () =>
    <ProjectStoreState>{
      projects: [],
      selectedProjectId: useLocalStorage("selectedProjectId", null),
    },
  actions: {
    setProjects(projects: Project[]) {
      this.projects = projects;
    },
    setSelectedProject(projectId: string | null) {
      this.selectedProjectId = projectId;
    },
  },
  getters: {
    selectedProject: (state) =>
      state.projects.find(
        (project) => project._id === state.selectedProjectId
      ) || null,
  },
});
