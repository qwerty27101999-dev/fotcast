import { Scenario } from "./scenarioTypes";

export const baseScenario: Scenario = {
  id: "base",

  name: "Base",

  salaryMultiplier: 1,

  monthlyBonusMultiplier: 1,

  quarterlyBonusMultiplier: 1,

  annualBonusMultiplier: 1,

  hiringMultiplier: 1,

  insuranceEnabled: true,

  description: "Current company plan",
};

export const optimisticScenario: Scenario = {
  id: "optimistic",

  name: "Optimistic",

  salaryMultiplier: 1.1,

  monthlyBonusMultiplier: 1,

  quarterlyBonusMultiplier: 1,

  annualBonusMultiplier: 1,

  hiringMultiplier: 1.15,

  insuranceEnabled: true,

  description: "Growth scenario",
};

export const freezeScenario: Scenario = {
  id: "freeze",

  name: "Hiring Freeze",

  salaryMultiplier: 1,

  monthlyBonusMultiplier: 1,

  quarterlyBonusMultiplier: 1,

  annualBonusMultiplier: 1,

  hiringMultiplier: 0,

  insuranceEnabled: true,

  description: "Freeze all hiring",
};

export const scenarios = [
  baseScenario,
  optimisticScenario,
  freezeScenario,
];