import {Task} from "./Task.js";

export interface Category {
  id: number;
  name: string;
  tasks: Task[];
}