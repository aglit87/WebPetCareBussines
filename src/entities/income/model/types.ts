export interface IncomeStatDTO {
  id: string;
  icon: string;
  iconColor: string;
  iconTint: string;
  value: string;
  label: string;
  delta?: string;
  deltaPositive?: boolean;
}

export interface IncomeDayDTO {
  id: string;
  date: string;
  amount: string;
  count: number;
  share: number; // 0..100, for the bar visualization
}

export interface IncomeDTO {
  stats: IncomeStatDTO[];
  days: IncomeDayDTO[];
}
