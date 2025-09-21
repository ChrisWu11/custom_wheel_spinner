export interface HistoryRecord {
  id: number;
  title: string;
  result: string;
  timestamp: string;
  items: string[];
}

export interface WheelData {
  title: string;
  items: string[];
  spinDuration: number;
}