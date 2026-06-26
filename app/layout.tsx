import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FOTcast",
  description: "Payroll & headcount analytics engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <div className="app-shell">

          <header className="app-header">
            <h1>FOTcast</h1>
            <p>Payroll & headcount analytics engine</p>
          </header>

          <main>
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}