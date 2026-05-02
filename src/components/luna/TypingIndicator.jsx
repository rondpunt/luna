export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2">
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-[4px_16px_16px_16px]"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          minWidth: 56,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "rgba(165,180,252,0.5)",
              animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { opacity: 0.2; transform: scale(0.9); }
          30% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}