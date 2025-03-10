export interface ProjectInterface {
  id: number;
  name: string;
  parentProject: number;
  status: string;
  imageUrl: string;
  detail: string;
  startDate: Date;
  endDate: Date;
}
