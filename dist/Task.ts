export interface Task {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}