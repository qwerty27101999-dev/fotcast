import { Employee } from "@/lib/types";

export const emptyEmployee: Employee = {
  id: crypto.randomUUID(),

  name: "",

  department: "",

  hire_date: "",

  termination_date: "",

  salary: 0,

  monthly_bonus: 0,

  quarterly_bonus: 0,

  annual_bonus: 0,
};