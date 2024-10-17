export interface Task {
  id: string;
  name: string;
  description: string;
  project: string;
  assignedTo: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
}
