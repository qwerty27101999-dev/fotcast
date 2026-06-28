import { HeadcountTable } from "../tables/HeadcountTable";

export function HeadcountPage({
  headcount,
  months,
}: any) {

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