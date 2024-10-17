import type { Project } from "~/models/project";

export class ProjectService {
  static async fetchProjects(): Promise<Project[]> {
    try {
      const { data, error } = await useApi<Project[]>("/api/projects");
      if (error) {
        throw new Error("Error fetching projects: " + error);
      }
      return data || [];
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      throw error;
    }
  }

  static async fetchProjectById(projectId: string): Promise<Project> {
    try {
      const { data, error } = await useApi<Project>(
        `/api/projects/${projectId}`
      );
      if (error) {
        throw new Error("Error fetching project: " + error);
      }
      return data!;
    } catch (error) {
      console.error("Failed to fetch project:", error);
      throw error;
    }
  }

  static async createProject(project: Project): Promise<Project> {
    try {
      const { data, error } = await useApi<Project>("/api/projects", {
        method: "POST",
        body: JSON.stringify(project),
      });
      if (error) {
        throw new Error("Error creating project: " + error);
      }
      return data!;
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  }

  static async updateProject(project: Project): Promise<Project> {
    try {
      const { data, error } = await useApi<Project>(
        `/api/projects/${project._id}`,
        {
          method: "PUT",
          body: JSON.stringify(project),
        }
      );
      if (error) {
        throw new Error("Error updating project: " + error);
      }
      return data!;
    } catch (error) {
      console.error("Failed to update project:", error);
      throw error;
    }
  }

  static async deleteProject(projectId: string): Promise<void> {
    try {
      const { error } = await useApi<void>(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (error) {
        throw new Error("Error deleting project: " + error);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  }
}
