/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["'Inter'", "system-ui", "sans-serif"],
        display: ["'Quicksand'", "'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        // Junie brand palette
        cream:         "#FFFBF7",
        "cream-soft":  "#FFF6EC",
        "junie-blue":   "#6A9AD9",
        "junie-green":  "#7BC096",
        "junie-yellow": "#F0C674",
        "junie-orange": "#F0925E",
        "junie-coral":  "#EC6F6F",
        "junie-purple": "#9B7FC4",
        ink:           "#2D2A3A",
        "ink-soft":    "#5A546B",
        "ink-muted":   "#8A8499",
        "ink-faint":   "#B8B0C2",

        // shadcn tokens
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
      },
      borderRadius: {
        lg:   "var(--radius)",
        md:   "calc(var(--radius) - 2px)",
        sm:   "calc(var(--radius) - 4px)",
        xl:   "22px",
        "2xl": "28px",
        "3xl": "36px",
        pill: "999px",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        fadeUp: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":        "fadeUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in":        "fadeIn 0.35s ease-out both",
      },
      maxWidth: { app: "480px" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
