import {
  getTotalCost,
  getTotalFOT,
  getTotalInsurance,
} from "./payrollMetrics";

import {
  getAverageHeadcount,
  getPeakHeadcount,
  getMinHeadcount,
} from "./headcountMetrics";

import { PayrollEmployee } from "../types";

export function buildDashboardMetrics(
  payroll: PayrollEmployee[],
  monthlyHeadcount: number[]
) {
  const totalCost = getTotalCost(payroll);

  const totalFOT = getTotalFOT(payroll);

  const insurance = getTotalInsurance(payroll);

  const avgHeadcount =
    getAverageHeadcount(monthlyHeadcount);

  const peakHeadcount =
    getPeakHeadcount(monthlyHeadcount);

  const minHeadcount =
    getMinHeadcount(monthlyHeadcount);

  const avgCostPerEmployee =
    avgHeadcount > 0
      ? totalCost / avgHeadcount
      : 0;

  const avgFOTPerEmployee =
    avgHeadcount > 0
      ? totalFOT / avgHeadcount
      : 0;

  return {
    totalCost,
    totalFOT,
    insurance,

    avgHeadcount,
    peakHeadcount,
    minHeadcount,

    avgCostPerEmployee,
    avgFOTPerEmployee,
  };
}