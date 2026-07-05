import * as XLSX from "xlsx";

import { Employee, PayrollEmployee } from "@/lib/types";

interface ToolbarProps {
  data: Employee[];
  setData: React.Dispatch<React.SetStateAction<Employee[]>>;

  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;

  onExport: () => void;

  payroll: PayrollEmployee[];
  months: Date[];
}

export function Toolbar({
  data,
  setData,
  year,
  setYear,
  onExport,
}: ToolbarProps) {

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (
      event: ProgressEvent<FileReader>
    ) => {

      try {

        const result = event.target?.result;

        if (!(result instanceof ArrayBuffer)) {
          return;
        }

        const bytes = new Uint8Array(result);

        const workbook = XLSX.read(bytes, {
          type: "array",
        });

        const sheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];

        const json =
          XLSX.utils.sheet_to_json<Employee>(
            sheet
          );

        setData(json);

      } catch (error) {

        console.error(
          "Excel parse error:",
          error
        );

      }

    };

    reader.readAsArrayBuffer(file);

  };

  return (

    <div className="toolbar">

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >

        <label className="btn btn-primary">

          📂 Upload Excel

          <input
            type="file"
            hidden
            onChange={handleFile}
          />

        </label>

        <button
          className="btn"
          onClick={onExport}
        >

          📤 Export

        </button>

        <select
          value={year}
          onChange={(e) =>
            setYear(
              Number(e.target.value)
            )
          }
        >

          {Array.from(
            { length: 3 },
            (_, i) =>
              new Date().getFullYear() + i
          ).map((y) => (

            <option
              key={y}
              value={y}
            >

              {y}

            </option>

          ))}

        </select>

      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          opacity: 0.9,
        }}
      >

        <button className="btn btn-ghost">

          ⚙️ Settings

        </button>

      </div>

    </div>

  );

}