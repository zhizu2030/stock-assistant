
export interface Stock {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  marketCap?: number;
  pe?: number;
}

export interface KLineData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface WatchlistItem {
  id: string;
  stockCode: string;
  addedAt: Date;
}
