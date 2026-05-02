import { motion, AnimatePresence } from "framer-motion";

export default function CrisisModal({ open, onContinue, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[998] flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.85)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="rounded-2xl p-6 max-w-sm w-full"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(239,68,68,0.25)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(239,68,68,0.1)",
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <h2
              className="text-xl mb-3"
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontStyle: "italic",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              Even pauzeren.
            </h2>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}
            >
              Ik merk dat je het zwaar hebt. Bel nu:{" "}
              <strong style={{ color: "rgba(255,255,255,0.92)" }}>
                Zelfmoordlijn 0800 32 123
              </strong>{" "}
              — gratis, 24/7, anoniem. Of Tele-Onthaal:{" "}
              <strong style={{ color: "rgba(255,255,255,0.92)" }}>106</strong>.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="tel:080032123"
                className="flex items-center justify-center py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Bel nu — 0800 32 123
              </a>
              <button
                onClick={onContinue}
                className="py-3 rounded-xl text-sm"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Ik ben veilig, ga verder
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}