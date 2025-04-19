export interface IMostUsedComponent {
  component_id: number;
  component_name: string;
  times_used: number;
  total_units_used: number;
}

export interface IDeviceFailureRank {
  device: string;
  component: string;
  failure_count: number;
}

export interface IHistoricDateItem {
  id: number;
  component_name: string;
  month: Date;
  units_used: number;
}
