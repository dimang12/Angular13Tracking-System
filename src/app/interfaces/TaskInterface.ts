export interface TaskInterface {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date;
  priority: string;
  project: string;
  createdAt: Date;
  updatedAt: Date;
}
