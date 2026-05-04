import { useState } from "react";
import CrisisSheet from "./CrisisSheet";

export default function CrisisButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Hulp nu — crisis lijn"
        className="fixed z-50"
        style={{
          top: "calc(20px + env(safe-area-inset-top, 0px))",
          right: 20,
          height: 36,
          padding: "0 14px",
          borderRadius: 18,
          background: "rgba(209,77,77,0.06)",
          border: "1px solid rgba(209,77,77,0.30)",
          color: "#D14D4D",
          fontFamily: "'Geist', system-ui, sans-serif",
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(209,77,77,0.12)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(209,77,77,0.06)"}
      >
        Hulp nu
      </button>
      {open && <CrisisSheet onClose={() => setOpen(false)} />}
    </>
  );
}
