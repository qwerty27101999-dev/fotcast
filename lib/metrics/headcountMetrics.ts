export function getAverageHeadcount(
  monthlyHeadcount: number[]
) {
  if (monthlyHeadcount.length === 0) return 0;

  return (
    monthlyHeadcount.reduce(
      (a, b) => a + b,
      0
    ) / monthlyHeadcount.length
  );
}

export function getPeakHeadcount(
  monthlyHeadcount: number[]
) {
  if (monthlyHeadcount.length === 0) return 0;

  return Math.max(...monthlyHeadcount);
}

export function getMinHeadcount(
  monthlyHeadcount: number[]
) {
  if (monthlyHeadcount.length === 0) return 0;

  return Math.min(...monthlyHeadcount);
}