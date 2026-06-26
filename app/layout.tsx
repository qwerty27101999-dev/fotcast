import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <title>FOTcast</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body>
        {children}
      </body>
    </html>
  );
}