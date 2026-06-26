import { insuranceConfig } from "./config/insuranceConfig";

export function calculateInsurance(
  base: number,
  cumulativeBase: number
) {
  const remainingCap = Math.max(
    insuranceConfig.cap - cumulativeBase,
    0
  );

  let ops = 0;
  let oms = 0;
  let vnim = 0;
  let nsipz = 0;

  if (remainingCap >= base) {
    ops = base * insuranceConfig.rates.ops;
    oms = base * insuranceConfig.rates.oms;
    vnim = base * insuranceConfig.rates.vnim;
  } else {
    const low = remainingCap;
    const high = base - remainingCap;

    const lowRate =
      insuranceConfig.rates.ops +
      insuranceConfig.rates.oms +
      insuranceConfig.rates.vnim;

    const highRate =
      insuranceConfig.rates.reducedAfterCap;

    const insurance =
      low * lowRate +
      high * highRate;

    nsipz = base * insuranceConfig.rates.nsipz;

    return {
      ops: 0,
      oms: 0,
      vnim: 0,
      nsipz: Math.round(nsipz),
      total: Math.round(insurance + nsipz),
    };
  }

  nsipz = base * insuranceConfig.rates.nsipz;

  return {
    ops: Math.round(ops),
    oms: Math.round(oms),
    vnim: Math.round(vnim),
    nsipz: Math.round(nsipz),
    total: Math.round(
      ops + oms + vnim + nsipz
    ),
  };
}