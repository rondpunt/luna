// Premium haptics utility — system-vriendelijk, nooit opdringerig.
// Volgt de UX-blueprint: soft voor mood/chat, sterker voor critical events.

const supported = () => typeof window !== "undefined" && "vibrate" in navigator;

export const haptic = {
  /** Zachte tap — bevestiging van een normale interactie (mood log, save). */
  soft: () => { try { if (supported()) navigator.vibrate(8); } catch {} },
  /** Medium — send/submit, paywall keuze. */
  medium: () => { try { if (supported()) navigator.vibrate(14); } catch {} },
  /** Sterk — critical: crisis FAB, account delete, double-confirm. */
  strong: () => { try { if (supported()) navigator.vibrate([18, 40, 18]); } catch {} },
  /** Succes — twee korte pulses, voor "klaar"-momenten. */
  success: () => { try { if (supported()) navigator.vibrate([10, 60, 10]); } catch {} },
};