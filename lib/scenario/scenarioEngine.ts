import { Scenario } from "./scenarioTypes";
import { baseScenario } from "./scenarioDefaults";

export function getScenario(
  id?: string
): Scenario {

  if (!id) {
    return baseScenario;
  }

  switch (id) {

    case "optimistic":
      return {
        ...baseScenario,
        salaryMultiplier: 1.1,
        hiringMultiplier: 1.15,
        name: "Optimistic",
      };

    case "freeze":
      return {
        ...baseScenario,
        hiringMultiplier: 0,
        name: "Hiring Freeze",
      };

    default:
      return baseScenario;
  }

}