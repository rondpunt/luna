import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { groupConversationsByDate } from "@/lib/dateGroups";
import ConvoItem from "./ConvoItem";
import ConvoOptionsMenu from "./ConvoOptionsMenu";
import MoveToFolderMenu from "./MoveToFolderMenu";
import DeleteConvoDialog from "./DeleteConvoDialog";

/**
 * Reusable conversation list with all manage features.
 * Visibility of features driven by `settings` (from useChatSettings).
 */
export default function ConversationList({
  conversations = [],
  folders = [],
  settings,
  searchQuery = "",
  hideFolderId = false,    // when listing inside a folder, we don't need folder context
  emptyState = null,
}) {
  const qc = useQueryClient();
  const [renamingId, setRenamingId] = useState(null);
  const [menuConv, setMenuConv] = useState(null);
  const [moveConv, setMoveConv] = useState(null);
  const [deleteConv, setDeleteConv] = useState(null);

  const folderById = useMemo(() => Object.fromEntries(folders.map((f) => [f.id, f])), [folders]);

  const filtered = useMemo(() => {
    let list = conversations;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) =>
        (c.title || "").toLowerCase().includes(q) ||
        (c.summary || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [conversations, searchQuery]);

  // Pinned first if pin feature on
  const sorted = useMemo(() => {
    if (!settings?.showPin) return filtered;
    return [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [filtered, settings?.showPin]);

  const groups = useMemo(() => {
    if (!settings?.showDateGroups) return [["", sorted]];
    // Pinned skip grouping
    const pinned = settings?.showPin ? sorted.filter((c) => c.pinned) : [];
    const rest = settings?.showPin ? sorted.filter((c) => !c.pinned) : sorted;
    const dateGroups = groupConversationsByDate(rest);
    return pinned.length > 0 ? [["📌 Vastgepind", pinned], ...dateGroups] : dateGroups;
  }, [sorted, settings?.showDateGroups, settings?.showPin]);

  const renameMut = useMutation({
    mutationFn: ({ id, title }) => base44.entities.Conversation.update(id, { title }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });
  const moveMut = useMutation({
    mutationFn: ({ id, folder }) =>
      base44.entities.Conversation.update(id, {
        folderId: folder?.id || "",
        folderName: folder?.name || "",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });
  const togglePinMut = useMutation({
    mutationFn: ({ id, pinned }) => base44.entities.Conversation.update(id, { pinned }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });
  const archiveMut = useMutation({
    mutationFn: ({ id, archived }) => base44.entities.Conversation.update(id, { archived }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Conversation.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
      setDeleteConv(null);
    },
  });

  if (sorted.length === 0) {
    return emptyState;
  }

  return (
    <>
      <div className="space-y-5">
        {groups.map(([groupName, items]) => (
          <div key={groupName || "all"}>
            {settings?.showDateGroups && groupName && (
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-2 px-3" style={{ color: "var(--text-3)" }}>
                {groupName}
              </p>
            )}
            <div
              className="rounded-2xl py-1"
              style={{ background: "var(--bg-card)", border: "1px solid var(--line)" }}
            >
              {items.map((conv) => {
                const folder = !hideFolderId ? folderById[conv.folderId] : null;
                const linkTo = conv.folderId
                  ? `/chat?conv=${conv.id}&folder=${conv.folderId}`
                  : `/chat?conv=${conv.id}`;
                return (
                  <ConvoItem
                    key={conv.id}
                    conv={conv}
                    folder={folder}
                    compact={settings?.compactList}
                    showQuickMove={settings?.showQuickMove}
                    isRenaming={renamingId === conv.id}
                    onCancelRename={() => setRenamingId(null)}
                    onRename={(newTitle) => {
                      renameMut.mutate({ id: conv.id, title: newTitle });
                      setRenamingId(null);
                    }}
                    onOpenMenu={(c) => setMenuConv(c)}
                    onQuickMove={(c) => setMoveConv(c)}
                    to={linkTo}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {menuConv && (
        <ConvoOptionsMenu
          conv={menuConv}
          showPin={settings?.showPin}
          showArchive={settings?.showArchive}
          onClose={() => setMenuConv(null)}
          onRename={() => { setRenamingId(menuConv.id); setMenuConv(null); }}
          onMove={() => { setMoveConv(menuConv); setMenuConv(null); }}
          onTogglePin={() => {
            togglePinMut.mutate({ id: menuConv.id, pinned: !menuConv.pinned });
            setMenuConv(null);
          }}
          onArchive={() => {
            archiveMut.mutate({ id: menuConv.id, archived: !menuConv.archived });
            setMenuConv(null);
          }}
          onDelete={() => { setDeleteConv(menuConv); setMenuConv(null); }}
        />
      )}

      {moveConv && (
        <MoveToFolderMenu
          folders={folders}
          currentFolderId={moveConv.folderId}
          onSelect={(folder) => {
            moveMut.mutate({ id: moveConv.id, folder });
            setMoveConv(null);
          }}
          onClose={() => setMoveConv(null)}
        />
      )}

      {deleteConv && (
        <DeleteConvoDialog
          conv={deleteConv}
          deleting={deleteMut.isPending}
          onConfirm={() => deleteMut.mutate(deleteConv.id)}
          onCancel={() => setDeleteConv(null)}
        />
      )}
    </>
  );
}