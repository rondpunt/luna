import { useState } from "react";

const CATEGORIES = {
  "😊": ["😊", "😂", "🥹", "😭", "😢", "😔", "😞", "😟", "😤", "😠", "🥺", "😩", "😫", "😓", "😥", "😰", "😨", "😱", "😇", "🥰", "😍", "🤗", "😌", "😴", "🤔", "😶", "😐", "😑", "🙄", "😒"],
  "❤️": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💝", "💘", "💟", "☮️", "✨", "🌟", "💫", "⭐", "🌈", "🌸", "🌺", "🌻", "🍀", "🌿", "🌱"],
  "👍": ["👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤙", "👋", "🙌", "👏", "🤝", "🙏", "💪", "🫂", "🫶", "💆", "🧘", "🏃", "🚶", "🛌", "💤", "🫁", "🧠", "💊", "🩺", "🩻", "🌡️", "💉"],
  "😤": ["😤", "😡", "🤬", "😶‍🌫️", "😵", "😵‍💫", "🤯", "😳", "🥴", "😷", "🤒", "🤕", "🤢", "🤮", "😪", "😮", "😯", "😲", "🙀", "😿", "😾", "👿", "💀", "☠️", "💣", "⚡", "🌊", "🌪️", "🔥", "❄️"],
};

const CAT_KEYS = Object.keys(CATEGORIES);

export default function EmojiPicker({ onSelect, onClose }) {
  const [cat, setCat] = useState(CAT_KEYS[0]);

  return (
    <div
      className="shrink-0 border-t"
      style={{
        background: "#141414",
        borderColor: "rgba(255,255,255,0.06)",
        height: 260,
      }}
    >
      {/* Category tabs */}
      <div
        className="flex gap-1 px-3 pt-2 pb-1 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {CAT_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => setCat(k)}
            className="flex-1 py-1.5 text-lg rounded-lg transition-all"
            style={{ background: cat === k ? "rgba(194,90,50,0.20)" : "transparent" }}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="grid grid-cols-10 gap-0 px-2 py-2 overflow-y-auto" style={{ height: 196 }}>
        {CATEGORIES[cat].map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="flex h-10 w-full items-center justify-center rounded-lg text-2xl active:bg-white/10"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}