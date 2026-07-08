"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface Props {
  values: string[];
  allValues: string[];

  selected: string[];

  formatValue: (value: unknown) => string;

  onApply: (values: string[]) => void;

  onClose: () => void;

  position?: {
    top: number;
    left: number;
  };
}

export function TableFilterMenu({
  values,
  allValues,
  selected,
  formatValue,
  onApply,
  onClose,
  position,
}: Props) {
  const menuRef =
    useRef<HTMLDivElement>(null);

  //
  // Search
  //

  const [search, setSearch] =
    useState("");

  //
  // checkedMap
  //

  const [checked, setChecked] =
    useState<Record<string, boolean>>({});

  //
  // Sync from parent
  //

  useEffect(() => {
    const map: Record<
      string,
      boolean
    > = {};

    allValues.forEach(value => {
      map[value] =
        selected.includes(value);
    });

    setChecked(map);
  }, [selected, allValues]);

  //
  // Click outside
  //

  useEffect(() => {
    function outside(
      event: MouseEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        onClose();
      }
    }

    document.addEventListener(
      "mousedown",
      outside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        outside
      );
  }, [onClose]);

  //
  // Search
  //

  const visibleValues = useMemo(() => {
      return values;

    const q =
      search.toLowerCase();

    return values.filter(v =>
      v.toLowerCase().includes(q)
    );
  }, [search, values]);

  //
  // Toggle
  //

  function toggle(value: string) {
    setChecked(prev => ({
      ...prev,
      [value]: !prev[value],
    }));
  }

  //
  // ALL (visible only)
  //

  function selectAll() {
    setChecked(prev => {
      const next = { ...prev };

      visibleValues.forEach(v => {
        next[v] = true;
      });

      return next;
    });
  }

  //
  // NONE (visible only)
  //

  function clearAll() {
    setChecked(prev => {
      const next = { ...prev };

      visibleValues.forEach(v => {
        next[v] = false;
      });

      return next;
    });
  }

  //
  // APPLY
  //

  function apply() {

  const result =
    allValues.filter(
      value => checked[value]
    );

  onApply(result);

  onClose();

}

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        width: 260,
        background: "#fff",
        border:
          "1px solid #d1d5db",
        borderRadius: 10,
        boxShadow:
          "0 8px 24px rgba(0,0,0,.15)",
        padding: 12,
        zIndex: 9999,
      }}
    >
      <input
        value={search}
        onChange={e =>
          setSearch(
            e.target.value
          )
        }
        placeholder="Search..."
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 10,
        }}
      />

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <button
          className="btn"
          onClick={selectAll}
        >
          All
        </button>

        <button
          className="btn"
          onClick={clearAll}
        >
          None
        </button>
      </div>

      <div
        style={{
          maxHeight: 260,
          overflowY: "auto",
        }}
      >
        {visibleValues.map(value => (
  <label
    key={value}
    style={{
      display: "flex",
      gap: 8,
      padding: "4px 0",
    }}
  >
    <input
      type="checkbox"
      checked={
        checked[value] ??
        false
      }
      onChange={() =>
        toggle(value)
      }
    />

    {formatValue(value)}

  </label>
))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "flex-end",
          gap: 8,
          marginTop: 12,
        }}
      >
        <button
          className="btn"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          className="btn"
          onClick={apply}
        >
          Apply
        </button>
      </div>
    </div>
  );
}