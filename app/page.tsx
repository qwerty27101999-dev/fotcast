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

      {/* VIEW */}
      {tab === "fot" && data.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>💰 ФОТ (годовой по сотрудникам)</h3>

          {employeeRows.map((e, i) => (
            <p key={i}>
              {e.name}: <b>{e.yearlyTotal.toLocaleString()} ₽</b>
            </p>
          ))}
        </div>
      )}

      {tab === "headcount" && data.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>👥 Численность</h3>

          {headcountByMonth.map((m, i) => (
            <p key={i}>
              {m.month}: <b>{m.count}</b>
            </p>
          ))}
        </div>
      )}
    </main>
  );
}