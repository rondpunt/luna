export default function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl bg-white p-5 ${className}`}
      style={{ border: "1px solid rgba(63,138,85,0.12)" }}
    >
      {children}
    </div>
  );
}