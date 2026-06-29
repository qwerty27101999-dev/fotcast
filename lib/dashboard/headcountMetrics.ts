export interface MonthlyHeadcount {

  month: number;

  value: number;

}

export function buildMonthlyHeadcount(
  headcount: any[]
): MonthlyHeadcount[] {

  return Array.from(
    { length: 12 },
    (_, month) => {

      const value = headcount.reduce(

        (sum, dep) =>

          sum + Number(dep[month] ?? 0),

        0

      );

      return {

        month,

        value,

      };

    }
  );

}