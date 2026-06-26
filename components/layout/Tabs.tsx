export function Tabs({ tab, setTab }: any) {
  return (
    <div className="tabs">

      <button onClick={() => setTab("payroll")}>
        Payroll
      </button>

      <button onClick={() => setTab("headcount")}>
        Headcount
      </button>

    </div>
  );
}