import * as XLSX from "xlsx";

export function Toolbar({ data, setData, year, setYear }: any) {

  const handleFile = (e: any) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event: any) => {
    try {
      const data = new Uint8Array(event.target.result);

      const wb = XLSX.read(data, { type: "array" });

      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

console.log("EXCEL:", json);

setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("Excel parse error:", err);
    }
  };

  reader.readAsArrayBuffer(file);
};

  return (
    <div className="toolbar">

      <label>
        📂 Upload Excel
        <input type="file" onChange={handleFile} hidden />
      </label>

      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
      >
        {Array.from({ length: 3 }, (_, i) =>
          new Date().getFullYear() + i
        ).map(y => (
          <option key={y}>{y}</option>
        ))}
      </select>

    </div>
  );
}