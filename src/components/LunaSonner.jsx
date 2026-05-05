import { Toaster } from "sonner";

/** Sonner toasts for hooks like `useDailyReminder` (dark Luna shell). */
export function LunaSonner() {
  return (
    <Toaster
      theme="dark"
      position="top-center"
      richColors
      toastOptions={{
        style: {
          background: "#14141E",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#F2EDE3",
        },
      }}
    />
  );
}
