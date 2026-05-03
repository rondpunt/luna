import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

/**
 * Inline rename — Enter saves, Esc cancels, blur saves.
 * LibreChat pattern.
 */
export default function RenameForm({ initialValue, onSave, onCancel }) {
  const [value, setValue] = useState(initialValue || "");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === initialValue) {
      onCancel();
      return;
    }
    onSave(trimmed);
  };

  return (
    <div className="flex items-center gap-1.5 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          } else if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
        onBlur={submit}
        className="flex-1 min-w-0 bg-transparent text-[15px] outline-none px-1 py-0.5 rounded"
        style={{
          color: "var(--text)",
          border: "1px solid var(--accent)",
          background: "var(--bg-input)",
        }}
        maxLength={80}
      />
      <button
        onMouseDown={(e) => { e.preventDefault(); submit(); }}
        className="h-6 w-6 flex items-center justify-center rounded-md btn-press"
        style={{ color: "var(--green)" }}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
      <button
        onMouseDown={(e) => { e.preventDefault(); onCancel(); }}
        className="h-6 w-6 flex items-center justify-center rounded-md btn-press"
        style={{ color: "var(--text-3)" }}
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}