import { ExternalLink } from "lucide-react";

export default function SelfTestCard({ test }) {
  return (
    <a
      href={test.url}
      target="_blank"
      rel="noopener noreferrer"
      className="surface press"
      style={{ display: "block", padding: 18, textDecoration: "none", borderRadius: 18 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{test.name}</p>
          <p style={{ fontSize: 13, color: "#E8834A", marginBottom: 8 }}>{test.area}</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.55 }}>{test.description}</p>
        </div>
        <ExternalLink size={16} style={{ color: "var(--text-faint)", flexShrink: 0, marginTop: 2 }} strokeWidth={1.5} />
      </div>
    </a>
  );
}