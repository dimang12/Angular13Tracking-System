export interface TaskInterface {
  id: string;
  project: string;
  name: string;
  detail: string;
  description: string;
  dueDate: Date;
  status: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  priority: string;
  parentTask: string;
  loe: number;
  percentageCompletion: number;
}
