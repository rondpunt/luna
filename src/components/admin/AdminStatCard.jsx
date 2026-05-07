export default function AdminStatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
        <Icon className="h-5 w-5 text-orange-300" strokeWidth={1.8} />
      </div>
      <p className="text-3xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-white/55">{label}</p>
      {detail && <p className="mt-2 text-xs text-white/35">{detail}</p>}
    </div>
  );
}