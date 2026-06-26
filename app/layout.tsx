import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "fot'cast",
  description: "«Forecast your payroll before it happens»",
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
            <h1>fot'cast</h1>
            <p>«Forecast your payroll before it happens»</p>
          </header>

          <main>
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}