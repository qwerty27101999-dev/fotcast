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

  const {
    cap,
    rates,
  } = insuranceConfig;

  const remainingCap = Math.max(
    cap - input.cumulativeBase,
    0
  );

  let ops = 0;
  let oms = 0;
  let vnim = 0;

  // НСиПЗ начисляется всегда
  const nsipz =
    input.base * rates.nsipz;

  if (remainingCap >= input.base) {

    ops =
      input.base * rates.ops;

    oms =
      input.base * rates.oms;

    vnim =
      input.base * rates.vnim;

  } else {

    const lowBase = remainingCap;

    const highBase =
      input.base - remainingCap;

    const lowRate =
      rates.ops +
      rates.oms +
      rates.vnim;

    const reduced =
      highBase *
      rates.reducedAfterCap;

    return {

      ops: 0,

      oms: 0,

      vnim: 0,

      nsipz: round(nsipz),

      total: round(
        lowBase * lowRate +
        reduced +
        nsipz
      ),

    };

  }

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

function round(value: number) {
  return Math.round(value);
}