import React from "react";
import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="rounded-2xl px-4 py-3 flex gap-1.5 items-center"
        style={{
          background: "var(--bubble-luna)",
          borderLeft: "2px solid rgba(129,140,248,0.25)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--luna-accent)" }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}