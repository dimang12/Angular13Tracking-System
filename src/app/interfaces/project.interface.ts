export interface ProjectInterface {
  id: number;
  name: string;
  parentProject: number;
  status: string;
  imageUrl: string;
  detail: string;
  startDate: Date;
  endDate: Date;
  /**
   * Count all the tasks in the project
   * Every task is added to the project with the project id the taskCount will be increased by 1
   * @type {number} taskCount
   * @memberof ProjectInterface
   * @example 5
   * @default 0
   */
  taskCount: number;
  completionPercentage: number;
}
