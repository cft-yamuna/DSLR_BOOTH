export default function AppShell({ children }) {
  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="app-content">{children}</div>
    </main>
  );
}
