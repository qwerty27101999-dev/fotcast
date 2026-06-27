import * as XLSX from "xlsx";

export function Toolbar({
  data,
  setData,
  year,
  setYear,
}: any) {
  const handleFile = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event: any) => {
      try {
        const bytes = new Uint8Array(event.target.result);

        const wb = XLSX.read(bytes, { type: "array" });

        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        setData(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error("Excel parse error:", err);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const exportEmpty = () => {
    // временно: экспорт из page (передадим позже)
    alert("Export will be wired in next step");
  };

  return (
    <div className="toolbar">

      {/* LEFT SIDE */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>

        <label className="btn btn-primary">
          📂 Upload Excel
          <input type="file" hidden onChange={handleFile} />
        </label>

        <button className="btn" onClick={exportEmpty}>
          Export Excel
        </button>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {Array.from({ length: 3 }, (_, i) =>
            new Date().getFullYear() + i
          ).map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>

      </div>

      {/* RIGHT SIDE (future system) */}
      <div style={{ opacity: 0.5 }}>
        Company Settings (disabled)
      </div>

    </div>
  );
}