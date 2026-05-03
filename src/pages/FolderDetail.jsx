import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, Pencil, Sparkles, Archive, Settings2 } from "lucide-react";
import FolderFormSheet from "@/components/chat/FolderFormSheet";
import ConversationList from "@/components/chat/ConversationList";
import ConversationSearch from "@/components/chat/ConversationSearch";
import ChatSettingsSheet from "@/components/chat/ChatSettingsSheet";
import EmptyConversations from "@/components/chat/EmptyConversations";
import { useChatSettings } from "@/hooks/useChatSettings";

export default function FolderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
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

  const folder = folders.find((f) => f.id === id);
  const convos = conversations.filter(
    (c) => c.folderId === id && (settings.showArchive ? true : !c.archived)
  );

  const updateFolder = useMutation({
    mutationFn: (data) => base44.entities.ChatFolder.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["folders"] });
      setShowEdit(false);
    },
  });

  const archiveFolder = useMutation({
    mutationFn: () => base44.entities.ChatFolder.update(id, { archived: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["folders"] });
      navigate("/chat/folders");
    },
  });

  const startNewConversation = async () => {
    if (!user || !folder) return;
    const conv = await base44.entities.Conversation.create({
      userId: user.id,
      title: `Gesprek in ${folder.name}`,
      folderId: folder.id,
      folderName: folder.name,
      last_message_at: new Date().toISOString(),
      message_count: 0,
    });
    navigate(`/chat?conv=${conv.id}&folder=${folder.id}`);
  };

  if (!folder) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--bg)" }}>
        <p style={{ color: "var(--text-3)" }}>Map laden…</p>
      </div>
    );
  }

  const folderColor = folder.color || "#C25A32";

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
        <Link to="/chat/folders" className="flex items-center gap-1 btn-press" style={{ color: folderColor }}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          <span className="text-[16px] font-medium">Mappen</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl btn-press"
            style={{ background: "rgba(255,255,255,0.06)" }}
            aria-label="Instellingen"
          >
            <Settings2 className="h-[16px] w-[16px]" style={{ color: "var(--text-2)" }} />
          </button>
          <button
            onClick={() => setShowEdit(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl btn-press"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <Pencil className="h-[16px] w-[16px]" style={{ color: "var(--text-2)" }} />
          </button>
        </div>
      </div>

      <div className="px-4 pt-5 pb-10 space-y-6">

        {/* Folder identity */}
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[28px]"
            style={{ background: `${folderColor}20`, border: `1px solid ${folderColor}40` }}
          >
            {folder.emoji || "📁"}
          </div>
          <div>
            <h1 className="text-[22px] font-bold" style={{ color: "var(--text)", letterSpacing: "-0.4px" }}>{folder.name}</h1>
            {folder.description && (
              <p className="text-[14px] mt-0.5" style={{ color: "var(--text-2)" }}>{folder.description}</p>
            )}
          </div>
        </div>

        {/* Context block */}
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ background: `${folderColor}0D`, border: `1px solid ${folderColor}30` }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4" style={{ color: folderColor }} strokeWidth={1.8} />
            <p className="text-[13px] font-semibold" style={{ color: folderColor }}>Jouw context</p>
          </div>
          {folder.context ? (
            <p className="text-[14px] leading-[1.6]" style={{ color: "var(--text-2)" }}>
              {folder.context}
            </p>
          ) : (
            <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
              Geen context ingesteld. Voeg toe via de bewerkknop zodat Luna jouw achtergrond kent.
            </p>
          )}
          <button
            onClick={() => setShowEdit(true)}
            className="text-[13px] font-medium mt-1 btn-press"
            style={{ color: folderColor }}
          >
            {folder.context ? "Context aanpassen →" : "Context toevoegen →"}
          </button>
        </div>

        {/* New conversation CTA */}
        <button
          onClick={startNewConversation}
          className="w-full flex items-center justify-center gap-2.5 rounded-2xl py-4 text-[16px] font-semibold text-white btn-press"
          style={{ background: `linear-gradient(135deg, ${folderColor}cc, ${folderColor})`, boxShadow: `0 8px 24px ${folderColor}40` }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.2} />
          Nieuw gesprek starten
        </button>

        {/* Search (optional) */}
        {settings.showSearch && convos.length > 0 && (
          <ConversationSearch value={search} onChange={setSearch} placeholder="Zoek in deze map…" />
        )}

        {/* Conversations list */}
        {convos.length > 0 ? (
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest px-1 mb-3" style={{ color: "var(--text-3)" }}>
              Gesprekken{settings.showCounts ? ` · ${convos.length}` : ""}
            </p>
            <ConversationList
              conversations={convos}
              folders={folders}
              settings={settings}
              searchQuery={search}
              hideFolderId
              emptyState={<EmptyConversations title="Geen resultaten" sub="Probeer een andere zoekterm." />}
            />
          </div>
        ) : (
          <EmptyConversations title="Nog geen gesprekken" sub="Start je eerste gesprek in deze map." />
        )}

        {/* Danger zone */}
        <div className="pt-4">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 text-[14px] font-medium btn-press"
              style={{ color: "var(--text-3)" }}
            >
              <Archive className="h-4 w-4" />
              Map archiveren
            </button>
          ) : (
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{ background: "rgba(240,71,71,0.08)", border: "1px solid rgba(240,71,71,0.25)" }}
            >
              <p className="text-[14px] font-semibold" style={{ color: "#F04747" }}>Map archiveren?</p>
              <p className="text-[13px]" style={{ color: "var(--text-2)" }}>
                Gesprekken blijven bewaard maar de map verdwijnt uit je overzicht.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 rounded-xl py-3 text-[14px] font-medium btn-press"
                  style={{ background: "var(--bg-elevated)", color: "var(--text-2)" }}
                >
                  Annuleren
                </button>
                <button
                  onClick={() => archiveFolder.mutate()}
                  className="flex-1 rounded-xl py-3 text-[14px] font-semibold text-white btn-press"
                  style={{ background: "#F04747" }}
                >
                  Archiveren
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showEdit && (
        <FolderFormSheet
          defaults={folder}
          isEdit
          onSave={(data) => updateFolder.mutate(data)}
          onClose={() => setShowEdit(false)}
          saving={updateFolder.isPending}
        />
      )}

      {showSettings && <ChatSettingsSheet onClose={() => setShowSettings(false)} />}
    </div>
  );
}