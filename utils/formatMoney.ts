export function formatMoney(value: any): string {

  const number = Number(value ?? 0);

  return number.toLocaleString(

    "ru-RU",

    {

      minimumFractionDigits: 2,

      maximumFractionDigits: 2,

    }

  );

}