import { jsPDF } from "jspdf";
import { format } from "date-fns";

/**
 * @param {string} filename
 * @param {string} markdown
 */
export function downloadMarkdownFile(filename, markdown) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * @param {{ date?: string, notes?: string, emotions?: Record<string, number> }} entry
 */
export function diaryToMarkdown(entry) {
  const lines = [`# Luna dagboek — ${entry.date || ""}`, ""];
  if (entry.emotions) {
    lines.push("## Emoties", "");
    Object.entries(entry.emotions).forEach(([k, v]) => lines.push(`- ${k}: ${v}`));
    lines.push("");
  }
  lines.push("## Notities", "", entry.notes || "(leeg)", "");
  return lines.join("\n");
}

/**
 * @param {{ role: string, content: string }[]} messages
 */
export function conversationToMarkdown(title, messages) {
  const lines = [`# ${title}`, ""];
  messages.forEach((m) => {
    lines.push(`**${m.role === "user" ? "Jij" : "Luna"}**`, "", m.content || "", "");
  });
  return lines.join("\n");
}

/**
 * Simple text PDF (Luna Plus export).
 * @param {string} title
 * @param {string} body
 */
export function downloadTextPdf(title, body) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  let y = margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, margin, y);
  y += 28;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(body.replace(/\r\n/g, "\n"), 500);
  lines.forEach((line) => {
    if (y > 760) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 16;
  });
  doc.save(`luna-${format(new Date(), "yyyy-MM-dd")}.pdf`);
}
