export interface Scenario {
  id: string;

  name: string;

  salaryMultiplier: number;

  monthlyBonusMultiplier: number;

  quarterlyBonusMultiplier: number;

  annualBonusMultiplier: number;

  hiringMultiplier: number;

  insuranceEnabled: boolean;

  description?: string;
}