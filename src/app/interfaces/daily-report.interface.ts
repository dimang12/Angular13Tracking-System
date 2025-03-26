
export interface ReferenceInterface {
  id: string;
  name: string;
  type: 'task' | 'project';
}

export interface DailyReportInterface {
  id: string;
  // userId: string or null
  userId: string | null;
  reportDetail: string;
  date: Date;
  status: number;
  content: string;
  references: ReferenceInterface[];
}
