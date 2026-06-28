import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fot'cast",
  description: "FP&A Payroll & Headcount Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}