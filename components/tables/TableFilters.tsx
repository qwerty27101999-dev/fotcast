"use client";

interface Option {

  value: string;

  label: string;

}

interface Props {

  search: string;

  onSearchChange: (value: string) => void;

  sortField: string;

  onSortFieldChange: (value: string) => void;

  ascending: boolean;

  onAscendingChange: (value: boolean) => void;

  sortOptions: Option[];

}

export function TableFilters({

  search,

  onSearchChange,

  sortField,

  onSortFieldChange,

  ascending,

  onAscendingChange,

  sortOptions,

}: Props) {

  return (

    <div
      className="card"
      style={{
        marginBottom: 18,
        display: "flex",
        gap: 16,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >

      <input

        type="text"

        placeholder="Search..."

        value={search}

        onChange={(e) =>
          onSearchChange(
            e.target.value
          )
        }

        style={{
          minWidth: 260,
        }}

      />

      <select

        value={sortField}

        onChange={(e) =>
          onSortFieldChange(
            e.target.value
          )
        }

      >

        {sortOptions.map(option => (

          <option

            key={option.value}

            value={option.value}

          >

            {option.label}

          </option>

        ))}

      </select>

      <button

        className="btn"

        onClick={() =>
          onAscendingChange(
            !ascending
          )
        }

      >

        {ascending

          ? "▲ Asc"

          : "▼ Desc"}

      </button>

    </div>

  );

}