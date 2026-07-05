import { HeadcountRow } from "@/lib/headcountEngine";

import { HeadcountTable } from "../tables/HeadcountTable";

interface HeadcountPageProps {
  headcount: HeadcountRow[];
  months: Date[];
}

export function HeadcountPage({
  headcount,
  months,
}: HeadcountPageProps) {
  return (
    <>
      <h2>Headcount</h2>

      <HeadcountTable
        headcount={headcount}
        months={months}
      />
    </>
  );
}