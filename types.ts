
export interface StudentStats {
  total: number;
  boys: number;
  girls: number;
  lastUpdated: string;
}

export interface InsightData {
  summary: string;
  recommendation: string;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  ADMIN = 'ADMIN'
}
