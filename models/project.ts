import type { RemovableRef } from "@vueuse/core";

export interface Project {
  _id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
}

export interface ProjectStoreState {
  projects: Project[];
  selectedProjectId: RemovableRef<string | null>;
}
