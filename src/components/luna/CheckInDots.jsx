import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckInDots({ todayCheckIn, today }) {
  const [selected, setSelected] = useState(todayCheckIn?.score || null);
  const [saved, setSaved] = useState(false);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (score) => {
      if (todayCheckIn) {
        await base44.entities.CheckIn.update(todayCheckIn.id, { score });
      } else {
        await base44.entities.CheckIn.create({ score, date: today });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkIns"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const handleSelect = (score) => {
    setSelected(score);
    saveMutation.mutate(score);
  };

  return (
    <div
      className="w-full rounded-2xl p-5"
      style={{ background: "var(--bg-elev)" }}
    >
      <p
        className="text-sm font-medium mb-4"
        style={{ color: "var(--text-primary-luna)" }}
      >
        Hoe voel je je nu?
      </p>

      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
          <button
            key={score}
            onClick={() => handleSelect(score)}
            className="relative"
          >
            <motion.div
              className="w-6 h-6 rounded-full transition-all"
              style={{
                background:
                  selected === score
                    ? "var(--luna-accent)"
                    : "var(--luna-border)",
                boxShadow:
                  selected === score
                    ? "0 0 12px rgba(159,134,255,0.5)"
                    : "none",
              }}
              whileTap={{ scale: 0.85 }}
            />
          </button>
        ))}
      </div>

      <div className="flex justify-between px-0.5">
        <span className="text-[10px]" style={{ color: "var(--text-muted-luna)" }}>
          1
        </span>
        <span className="text-[10px]" style={{ color: "var(--text-muted-luna)" }}>
          10
        </span>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.p
            className="text-xs mt-2 text-center"
            style={{ color: "var(--luna-success)" }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Opgeslagen
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}