import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, MessageCircle, ChevronRight, Pencil, Trash2, Sparkles, Archive } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import FolderFormSheet from "@/components/chat/FolderFormSheet";

export default function FolderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const { data: folders = [] } = useQuery({
    queryKey: ["folders"],
    queryFn: () => base44.entities.ChatFolder.list("-created_date", 50),
  });
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => base44.entities.Conversation.list("-last_message_at", 100),
  });

  const folder = folders.find((f) => f.id === id);
  const convos = conversations.filter((c) => c.folderId === id && !c.archived);

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
        <button
          onClick={() => setShowEdit(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl btn-press"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <Pencil className="h-[16px] w-[16px]" style={{ color: "var(--text-2)" }} />
        </button>
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

        {/* Conversations list */}
        {convos.length > 0 && (
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest px-1 mb-3" style={{ color: "var(--text-3)" }}>
              Gesprekken · {convos.length}
            </p>
            <div className="list-group">
              {convos.map((conv) => (
                <Link
                  key={conv.id}
                  to={`/chat?conv=${conv.id}&folder=${folder.id}`}
                  className="list-row gap-3.5"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${folderColor}18` }}
                  >
                    <MessageCircle className="h-4 w-4" style={{ color: folderColor }} strokeWidth={1.7} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium truncate" style={{ color: "var(--text)" }}>{conv.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {conv.summary && (
                        <p className="text-[12px] truncate" style={{ color: "var(--text-3)", maxWidth: "180px" }}>
                          {conv.summary}
                        </p>
                      )}
                      {conv.last_message_at && (
                        <p className="text-[12px] shrink-0" style={{ color: "var(--text-3)" }}>
                          {format(new Date(conv.last_message_at), "d MMM", { locale: nl })}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0" style={{ color: "var(--text-3)" }} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {convos.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <MessageCircle className="h-10 w-10" style={{ color: "var(--text-4)" }} strokeWidth={1.2} />
            <p className="text-[15px] font-medium" style={{ color: "var(--text-3)" }}>Nog geen gesprekken</p>
            <p className="text-[13px]" style={{ color: "var(--text-4)" }}>Start je eerste gesprek in deze map.</p>
          </div>
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
    </div>
  );
}