import * as XLSX from "xlsx";

export function Toolbar({ data, setData, year, setYear }: any) {

  const handleFile = (e: any) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = (event: any) => {
      const wb = XLSX.read(event.target.result, { type: "binary" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      setData(json);
    };

    reader.readAsBinaryString(file);
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