export default function AdminUserList({ users, selectedId, onSelect }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-semibold text-white">Users</p>
        <p className="text-xs text-white/40">Klik een gebruiker voor profiel, woorden en chatlog</p>
      </div>
      <div className="max-h-[620px] overflow-y-auto p-2">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelect(user.id)}
            className="w-full rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.06]"
            style={{ background: selectedId === user.id ? "rgba(232,131,74,0.12)" : "transparent" }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{user.full_name || "Naam onbekend"}</p>
                <p className="truncate text-xs text-white/40">{user.email}</p>
              </div>
              <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/45">
                {user.stats.activeDays}d
              </span>
            </div>
            <div className="mt-2 flex gap-2 text-[11px] text-white/38">
              <span>{user.stats.userMessages} chats</span>
              <span>·</span>
              <span>{user.stats.checkins} check-ins</span>
              <span>·</span>
              <span>{user.selectedTags.length} woorden</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}