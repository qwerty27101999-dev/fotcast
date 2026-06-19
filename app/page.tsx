</th>
              ))}

              <th>Год</th>
            </tr>
          </thead>

          <tbody>
            {employeeRows.map((e, i) => (
              <tr key={i}>
                <td>{e.name}</td>

                <td>
                  {e.hireDate
                    ? e.hireDate.toLocaleDateString("ru-RU")
                    : "—"}
                </td>

                <td>{e.salary.toLocaleString()} ₽</td>

                {e.monthly.map((v: number, j: number) => (
                  <td key={j}>{v.toLocaleString()}</td>
                ))}

                <td>
                  <b>{e.yearlyTotal.toLocaleString()} ₽</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* FOT TAB */}
      {tab === "fot" && data.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>💰 ФОТ по сотрудникам</h3>

          {employeeRows.map((e, i) => (
            <p key={i}>
              {e.name}: <b>{e.yearlyTotal.toLocaleString()} ₽</b>
            </p>
          ))}
        </div>
      )}

      {/* HEADCOUNT TAB */}
      {tab === "headcount" && data.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>👥 Численность по месяцам</h3>

          <table border={1} cellPadding={6} style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Месяц</th>
                <th>Сотрудников</th>
              </tr>
            </thead>

            <tbody>
              {headcountByMonth.map((m, i) => (
                <tr key={i}>
                  <td>{m.month}</td>
                  <td><b>{m.count}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}