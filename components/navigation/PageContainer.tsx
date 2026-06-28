export function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="page-container">
      {children}
    </section>
  );
}