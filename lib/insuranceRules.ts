import { insuranceConfig } from "./config/insuranceConfig";

export interface InsuranceInput {
  base: number;
  cumulativeBase: number;
}

export interface InsuranceResult {
  ops: number;
  oms: number;
  vnim: number;
  nsipz: number;
  total: number;
}

export function calculateInsuranceByRules(
  input: InsuranceInput
): InsuranceResult {

  const rates = insuranceConfig.rates;

  const remainingCap = Math.max(
    insuranceConfig.cap - input.cumulativeBase,
    0
  );

  const nsipz =
    input.base * rates.nsipz;

  if (remainingCap >= input.base) {

    const ops =
      input.base * rates.ops;

    const oms =
      input.base * rates.oms;

    const vnim =
      input.base * rates.vnim;

    return {

      ops: round(ops),

      oms: round(oms),

      vnim: round(vnim),

      nsipz: round(nsipz),

      total: round(
        ops +
        oms +
        vnim +
        nsipz
      ),

    };

  }

  const lowBase = remainingCap;

  const highBase =
    input.base - remainingCap;

  const standardRate =
    rates.ops +
    rates.oms +
    rates.vnim;

  const reducedPart =
    highBase *
    rates.reducedAfterCap;

  return {

    ops: 0,

    oms: 0,

    vnim: 0,

    nsipz: round(nsipz),

    total: round(
      lowBase * standardRate +
      reducedPart +
      nsipz
    ),

  };

}

function round(value: number) {
  return Math.round(value);
}