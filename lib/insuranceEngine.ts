import {
  calculateInsuranceByRules,
  InsuranceResult,
} from "./insuranceRules";

export function calculateInsurance(
  base: number,
  cumulativeBase: number
): InsuranceResult {

  return calculateInsuranceByRules({

    base,

    cumulativeBase,

  });

}