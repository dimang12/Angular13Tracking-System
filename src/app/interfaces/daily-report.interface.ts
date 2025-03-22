export interface DailyReportInterface {
  id: string;
  // userId: string or null
  userId: string | null;
  reportDetail: string;
  date: Date;
  status: number;
}
