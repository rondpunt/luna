import { PhoneCall } from "lucide-react";

export default function UrgentHelpBanner() {
  return (
    <a
      href="tel:112"
      className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-4 py-2 text-xs font-medium text-destructive"
    >
      <PhoneCall className="h-3.5 w-3.5" />
      Need urgent help?
    </a>
  );
}