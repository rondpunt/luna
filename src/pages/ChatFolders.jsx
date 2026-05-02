import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, FolderOpen, MessageCircle, ChevronRight, X } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

const FOLDER_COLORS = ["#C25A32", "#4A9EFF", "#34C77B", "#F5A623", "#A855F7", "#F04747"];
const FOLDER_EMOJIS = ["💬", "😔", "😤", "🧠", "❤️", "🌙", "⚡", "🎯", "🌊", "🔥"];

export default function ChatFolders() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("💬");
  const [newColor, setNewColor] = useState("#C25A32");
  const [activeFolder, setActiveFolder] = useState(null);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: folders = [] } = useQuery({
    queryKey: ["folders"],
    queryFn: () => base44.entities.ChatFolder.list("-created_date", 50),
  });
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => base44.entities.Conversation.list("-last_message_at", 50),
  });

  const createFolder = useMutation({
    mutationFn: async () => {
      if (!newName.trim() || !user) return;
      await base44.entities.ChatFolder.create({
        userId: user.id,
        name: newName.trim(),
        emoji: newEmoji,
        color: newColor,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries(["folders"]);
      setNewName("");
      setShowNew(false);
    },
  });

  const myFolders = folders.filter((f) => f.userId === user?.id && !f.archived);
  const unorganized = conversations.filter((c) => c.userId === user?.id && !c.folderId && !c.archived);
  const folderConvos = (folderId) => conversations.filter((c) => c.folderId === folderId);

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: "var(--bg)", paddingTop: "env(safe-area-inset-top, 24px)" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/chat" className="flex items-center gap-1 btn-press" style={{ color: "#C25A32" }}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[16px] font-medium">Chat</span>
        </Link>
        <h1 className="text-[18px] font-bold" style={{ color: "var(--text)", letterSpacing: "-0.3px" }}>Gespreksmappen</h1>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 btn-press"
          style={{ background: "rgba(194,90,50,0.15)", border: "1px solid rgba(194,90,50,0.35)" }}
        >
          <Plus className="h-4 w-4" style={{ color: "#C25A32" }} />
          <span className="text-[13px] font-semibold" style={{ color: "#C25A32" }}>Nieuw</span>
        </button>
      </div>

      {/* New folder form */}
      {showNew && (
        <div
          className="rounded-2xl p-4 mb-5 space-y-4"
          style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>Nieuwe map</p>
            <button onClick={() => setShowNew(false)}><X className="h-4 w-4" style={{ color: "var(--text-3)" }} /></button>
          </div>

          {/* Emoji */}
          <div className="flex gap-2 flex-wrap">
            {FOLDER_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setNewEmoji(e)}
                className="text-[22px] h-10 w-10 rounded-xl flex items-center justify-center transition-all"
                style={{ background: newEmoji === e ? "rgba(194,90,50,0.20)" : "var(--bg-elevated)", border: `1px solid ${newEmoji === e ? "#C25A32" : "var(--line)"}` }}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Color */}
          <div className="flex gap-2">
            {FOLDER_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className="h-7 w-7 rounded-full transition-all"
                style={{ background: c, outline: newColor === c ? `3px solid ${c}` : "none", outlineOffset: "2px" }}
              />
            ))}
          </div>

          {/* Name input */}
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createFolder.mutate()}
            placeholder="Naam van de map…"
            autoFocus
            className="w-full rounded-xl px-4 py-3 text-[15px] outline-none"
            style={{ background: "var(--bg-input)", border: "1px solid var(--line)", color: "var(--text)" }}
          />

          <button
            onClick={() => createFolder.mutate()}
            disabled={!newName.trim()}
            className="w-full rounded-xl py-3 text-[15px] font-semibold text-white transition-all btn-press disabled:opacity-40 accent-gradient"
          >
            Map aanmaken
          </button>
        </div>
      )}

      {/* Folders */}
      {myFolders.length > 0 && (
        <div className="space-y-2 mb-6">
          <p className="text-[12px] font-semibold uppercase tracking-widest px-1 mb-3" style={{ color: "var(--text-3)" }}>
            Jouw mappen
          </p>
          {myFolders.map((folder) => {
            const convs = folderConvos(folder.id);
            const isOpen = activeFolder === folder.id;
            return (
              <div key={folder.id}>
                <button
                  onClick={() => setActiveFolder(isOpen ? null : folder.id)}
                  className="w-full list-group flex items-center gap-3.5 px-4 py-3.5 btn-press"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[20px]"
                    style={{ background: `${folder.color || "#C25A32"}18` }}
                  >
                    {folder.emoji || "📁"}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[15px] font-medium" style={{ color: "var(--text)" }}>{folder.name}</p>
                    <p className="text-[13px] mt-0.5" style={{ color: "var(--text-2)" }}>
                      {convs.length} {convs.length === 1 ? "gesprek" : "gesprekken"}
                    </p>
                  </div>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 transition-transform"
                    style={{ color: "var(--text-3)", transform: isOpen ? "rotate(90deg)" : "none" }}
                  />
                </button>

                {isOpen && convs.length > 0 && (
                  <div className="mt-1 space-y-1 pl-3">
                    {convs.map((conv) => (
                      <Link
                        key={conv.id}
                        to="/chat"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 btn-press"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
                      >
                        <MessageCircle className="h-4 w-4 shrink-0" style={{ color: "var(--text-3)" }} strokeWidth={1.7} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-medium truncate" style={{ color: "var(--text)" }}>{conv.title}</p>
                          {conv.last_message_at && (
                            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>
                              {format(new Date(conv.last_message_at), "d MMM", { locale: nl })}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Unorganized */}
      {unorganized.length > 0 && (
        <div className="space-y-1">
          <p className="text-[12px] font-semibold uppercase tracking-widest px-1 mb-3" style={{ color: "var(--text-3)" }}>
            Recente gesprekken
          </p>
          <div className="list-group">
            {unorganized.slice(0, 10).map((conv) => (
              <Link key={conv.id} to="/chat" className="list-row gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(194,90,50,0.12)" }}>
                  <MessageCircle className="h-4 w-4" style={{ color: "#C25A32" }} strokeWidth={1.7} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium truncate" style={{ color: "var(--text)" }}>{conv.title}</p>
                  {conv.last_message_at && (
                    <p className="text-[13px] mt-0.5" style={{ color: "var(--text-2)" }}>
                      {format(new Date(conv.last_message_at), "d MMM", { locale: nl })}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--text-3)" }} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {myFolders.length === 0 && unorganized.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
            <FolderOpen className="h-8 w-8" style={{ color: "var(--text-3)" }} strokeWidth={1.5} />
          </div>
          <p className="text-[16px] font-medium" style={{ color: "var(--text-2)" }}>Nog geen mappen</p>
          <p className="text-[14px] text-center px-8" style={{ color: "var(--text-3)" }}>
            Maak een map aan om gesprekken per thema bij te houden.
          </p>
          <button
            onClick={() => setShowNew(true)}
            className="mt-2 rounded-2xl px-6 py-3 text-[15px] font-semibold text-white accent-gradient btn-press"
          >
            Eerste map aanmaken
          </button>
        </div>
      )}
    </div>
  );
}