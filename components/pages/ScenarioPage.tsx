"use client";

import {
  Scenario,
  scenarios,
} from "@/lib/scenario";

interface Props {
  scenario: Scenario;
  setScenario: (scenario: Scenario) => void;
}

export function ScenarioPage({
  scenario,
  setScenario,
}: Props) {
  return (
    <>

      <h2>Scenario Manager</h2>

      <p
        style={{
          color: "#999",
          marginBottom: 24,
        }}
      >
        Select a planning scenario. All payroll calculations,
        dashboard metrics, charts and export will automatically
        use the selected scenario.
      </p>

      <div
        style={{
          display: "grid",
          gap: 16,
        }}
      >

        {scenarios.map((item) => {

          const active =
            item.id === scenario.id;

          return (

            <div
              key={item.id}
              className="card"
              style={{
                cursor: "pointer",
                border: active
                  ? "2px solid #3b82f6"
                  : "1px solid #2b2b2b",
                transition: ".15s",
              }}
              onClick={() => setScenario(item)}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >

                <div>

                  <h3
                    style={{
                      margin: 0,
                    }}
                  >
                    {item.name}
                  </h3>

                  <p
                    style={{
                      marginTop: 6,
                      color: "#999",
                    }}
                  >
                    {item.description}
                  </p>

                </div>

                {active && (
                  <div
                    style={{
                      color: "#3b82f6",
                      fontWeight: 700,
                    }}
                  >
                    ACTIVE
                  </div>
                )}

              </div>

              <hr
                style={{
                  margin: "16px 0",
                  borderColor: "#222",
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(220px,1fr))",
                  rowGap: 8,
                }}
              >

                <div>
                  Salary:
                  {" "}
                  {Math.round(
                    item.salaryMultiplier * 100
                  )}
                  %
                </div>

                <div>
                  Hiring:
                  {" "}
                  {Math.round(
                    item.hiringMultiplier * 100
                  )}
                  %
                </div>

                <div>
                  Monthly bonus:
                  {" "}
                  {Math.round(
                    item.monthlyBonusMultiplier *
                    100
                  )}
                  %
                </div>

                <div>
                  Quarterly bonus:
                  {" "}
                  {Math.round(
                    item.quarterlyBonusMultiplier *
                    100
                  )}
                  %
                </div>

                <div>
                  Annual bonus:
                  {" "}
                  {Math.round(
                    item.annualBonusMultiplier *
                    100
                  )}
                  %
                </div>

                <div>
                  Insurance:
                  {" "}
                  {item.insuranceEnabled
                    ? "Enabled"
                    : "Disabled"}
                </div>

              </div>

            </div>

          );

        })}

      </div>

    </>
  );
}