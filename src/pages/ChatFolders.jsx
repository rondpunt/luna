import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, FolderOpen, ChevronRight, Sparkles, Settings2 } from "lucide-react";
import FolderFormSheet from "@/components/chat/FolderFormSheet";
import ConversationList from "@/components/chat/ConversationList";
import ConversationSearch from "@/components/chat/ConversationSearch";
import EmptyConversations from "@/components/chat/EmptyConversations";
import ChatSettingsSheet from "@/components/chat/ChatSettingsSheet";
import { useChatSettings } from "@/hooks/useChatSettings";

const TEMPLATES = [
  { name: "Angst & piekeren",   emoji: "🌊", color: "#4A9EFF", description: "Voor als het hoofd niet stopt", context: "Ik heb last van angst en piekeren. Soms is het moeilijk om mijn gedachten te stoppen, vooral 's avonds of bij onzekerheid." },
  { name: "Werk & burn-out",    emoji: "🔥", color: "#F04747", description: "Alles rond werk en stress",      context: "Ik worstel met werkstress en ben op zoek naar hoe ik grenzen kan stellen zonder me schuldig te voelen." },
  { name: "Relaties",           emoji: "❤️", color: "#F04747", description: "Familie, vrienden, liefde",      context: "Ik wil praten over hoe ik omga met mensen die me na staan en hoe ik mezelf daarin niet verlies." },
  { name: "ADHD-dump",          emoji: "⚡", color: "#F5A623", description: "Alles wat in mijn hoofd zit",    context: "Ik heb ADHD (of denk dat ik dat heb). Mijn gedachten springen veel. Ik heb ruimte nodig om te dumpen zonder oordeel." },
  { name: "Slaap",              emoji: "🌙", color: "#A855F7", description: "Slaapproblemen en vermoeidheid", context: "Ik slaap slecht en voel me overdag uitgeput. Ik wil begrijpen wat me wakker houdt." },
  { name: "Zelfbeeld",          emoji: "🪞", color: "#34C77B", description: "Wie ben ik eigenlijk?",          context: "Ik heb vragen rond mijn zelfbeeld en zelfwaardering. Ik ben streng voor mezelf en wil dat veranderen." },
  { name: "Vrije ruimte",       emoji: "💬", color: "#C25A32", description: "Geen thema, gewoon praten",      context: "" },
];

export default function ChatFolders() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formDefaults, setFormDefaults] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [search, setSearch] = useState("");

  const { settings } = useChatSettings();

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: folders = [] } = useQuery({
    queryKey: ["folders"],
    queryFn: () => base44.entities.ChatFolder.list("-created_date", 50),
  });
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => base44.entities.Conversation.list("-last_message_at", 200),
  });

  const createFolder = useMutation({
    mutationFn: (data) => base44.entities.ChatFolder.create({ userId: user.id, ...data }),
    onSuccess: (folder) => {
      qc.invalidateQueries({ queryKey: ["folders"] });
      setShowForm(false);
      setShowTemplates(false);
      navigate(`/chat/folder/${folder.id}`);
    },
  });

  const myFolders = folders
    .filter((f) => f.userId === user?.id && !f.archived)
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const visibleConvos = conversations.filter(
    (c) => c.userId === user?.id && (settings.showArchive ? true : !c.archived)
  );
  const unorganized = visibleConvos.filter((c) => !c.folderId);

  const folderConvoCount = (folderId) =>
    conversations.filter((c) => c.folderId === folderId && !c.archived).length;

  const openNewBlank = () => {
    setFormDefaults(null);
    setShowTemplates(false);
    setShowForm(true);
  };
  const openFromTemplate = (tpl) => {
    setFormDefaults(tpl);
    setShowTemplates(false);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", paddingTop: "env(safe-area-inset-top, 0px)" }}>

      {/* Header */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-4"
        style={{
          background: "rgba(10,10,11,0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Link to="/chat" className="flex items-center gap-1 btn-press" style={{ color: "#C25A32" }}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[16px] font-medium">Chat</span>
        </Link>
        <h1 className="text-[17px] font-bold" style={{ color: "var(--text)", letterSpacing: "-0.3px" }}>Mappen</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="h-9 w-9 flex items-center justify-center rounded-full btn-press"
            style={{ background: "rgba(255,255,255,0.06)" }}
            aria-label="Instellingen"
          >
            <Settings2 className="h-[16px] w-[16px]" style={{ color: "var(--text-2)" }} />
          </button>
          <button
            onClick={() => setShowTemplates((v) => !v)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 btn-press"
            style={{ background: "rgba(194,90,50,0.15)", border: "1px solid rgba(194,90,50,0.35)" }}
          >
            <Plus className="h-4 w-4" style={{ color: "#C25A32" }} />
            <span className="text-[13px] font-semibold" style={{ color: "#C25A32" }}>Nieuw</span>
          </button>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-6 pt-5">

        {/* Search (optional) */}
        {settings.showSearch && (
          <ConversationSearch value={search} onChange={setSearch} />
        )}

        {/* Templates picker */}
        {showTemplates && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--line)", background: "var(--bg-card)" }}
          >
            <div className="px-4 pt-4 pb-3 flex items-center justify-between">
              <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Kies een startpunt</p>
              <button onClick={() => setShowTemplates(false)}>
                <span className="text-[13px]" style={{ color: "var(--text-3)" }}>Sluiten</span>
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  onClick={() => openFromTemplate(tpl)}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left btn-press transition-colors"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[20px]"
                    style={{ background: `${tpl.color}18` }}
                  >
                    {tpl.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>{tpl.name}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: "var(--text-2)" }}>{tpl.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--text-3)" }} />
                </button>
              ))}
              <button
                onClick={openNewBlank}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left btn-press"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <Plus className="h-5 w-5" style={{ color: "var(--text-3)" }} />
                </div>
                <p className="text-[14px] font-medium" style={{ color: "var(--text-2)" }}>Lege map aanmaken</p>
              </button>
            </div>
          </div>
        )}

        {/* My folders */}
        {myFolders.length > 0 && (
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest px-1 mb-3" style={{ color: "var(--text-3)" }}>
              Jouw mappen
            </p>
            <div className="space-y-2">
              {myFolders.map((folder) => (
                <Link
                  key={folder.id}
                  to={`/chat/folder/${folder.id}`}
                  className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5 btn-press"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[22px]"
                    style={{ background: `${folder.color || "#C25A32"}18` }}
                  >
                    {folder.emoji || "📁"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold truncate" style={{ color: "var(--text)" }}>{folder.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {folder.context && (
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" style={{ color: folder.color || "#C25A32" }} />
                          <span className="text-[12px]" style={{ color: "var(--text-3)" }}>Context</span>
                        </span>
                      )}
                      {settings.showCounts && (
                        <span className="text-[12px]" style={{ color: "var(--text-2)" }}>
                          {folderConvoCount(folder.id)} gesprekken
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--text-3)" }} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent conversations (across folders, not in folder) */}
        {unorganized.length > 0 && (
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest px-1 mb-3" style={{ color: "var(--text-3)" }}>
              Recente gesprekken
            </p>
            <ConversationList
              conversations={unorganized}
              folders={folders}
              settings={settings}
              searchQuery={search}
            />
          </div>
        )}

        {/* Empty state */}
        {myFolders.length === 0 && unorganized.length === 0 && !showTemplates && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}>
              <FolderOpen className="h-8 w-8" style={{ color: "var(--text-3)" }} strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-[17px] font-semibold mb-1" style={{ color: "var(--text)" }}>Begin met een map</p>
              <p className="text-[14px] px-8 leading-[1.6]" style={{ color: "var(--text-3)" }}>
                Organiseer je gesprekken per thema. Luna onthoudt de context van elke map.
              </p>
            </div>
            <button
              onClick={() => setShowTemplates(true)}
              className="mt-2 rounded-2xl px-6 py-3.5 text-[15px] font-semibold text-white accent-gradient btn-press"
            >
              Eerste map aanmaken
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <FolderFormSheet
          defaults={formDefaults}
          onSave={(data) => createFolder.mutate(data)}
          onClose={() => setShowForm(false)}
          saving={createFolder.isPending}
        />
      )}

      {showSettings && <ChatSettingsSheet onClose={() => setShowSettings(false)} />}
    </div>
  );
}