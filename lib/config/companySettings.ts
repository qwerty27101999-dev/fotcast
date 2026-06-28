import { insuranceConfig } from "./insuranceConfig";

export const companySettings = {
  companyName: "My Company",

  country: "RU",

  currency: "RUB",

  locale: "ru-RU",

  insurance: insuranceConfig,

  planning: {
    forecastYears: 3,
  },

  calendar: {
    weekends: [0, 6], // Sunday, Saturday
  },
};