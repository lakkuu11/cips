import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { listEnquiries, type Enquiry } from "@/lib/enquiries.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const fetchEnquiries = useServerFn(listEnquiries);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Enquiry | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["enquiries"],
    queryFn: () => fetchEnquiries(),
  });

  const isPermissionError = error instanceof Error && /permission|denied|policy/i.test(error.message);

  const programs = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((e) => e.program && set.add(e.program));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    let rows = data ?? [];
    if (programFilter !== "all") rows = rows.filter((r) => r.program === programFilter);
    if (dateFilter !== "all") {
      const now = Date.now();
      const days = dateFilter === "7d" ? 7 : dateFilter === "30d" ? 30 : 90;
      const cutoff = now - days * 24 * 60 * 60 * 1000;
      rows = rows.filter((r) => new Date(r.created_at).getTime() >= cutoff);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q) ||
          (r.message ?? "").toLowerCase().includes(q),
      );
    }
    return rows;
  }, [data, search, programFilter, dateFilter]);

  const exportCsv = () => {
    const headers = ["Name", "Email", "Phone", "Program", "Message", "Submitted"];
    const rows = filtered.map((r) => [
      r.name, r.email, r.phone, r.program ?? "", r.message ?? "", r.created_at,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">Enquiries Dashboard</h1>
            <p className="text-xs text-muted-foreground">CIPS Admin · {filtered.length} of {data?.length ?? 0} shown</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => refetch()} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent" disabled={isFetching}>
              {isFetching ? "Refreshing..." : "Refresh"}
            </button>
            <button onClick={exportCsv} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Export CSV
            </button>
            <button onClick={signOut} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, message..."
            className="flex-1 min-w-[240px] rounded-md border bg-background px-3 py-2 text-sm"
          />
          <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
            <option value="all">All programs</option>
            {programs.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
            <option value="all">All time</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {isLoading ? (
          <div className="rounded-lg border bg-card p-12 text-center text-sm text-muted-foreground">Loading enquiries...</div>
        ) : isPermissionError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm">
            <p className="font-semibold text-destructive">Admin role required</p>
            <p className="mt-1 text-muted-foreground">
              Your account is signed in but doesn't have the <code className="rounded bg-muted px-1">admin</code> role. Ask Lovable to grant your account admin access.
            </p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {(error as Error).message}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center text-sm text-muted-foreground">No enquiries match your filters.</div>
        ) : (
          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Program</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{r.name}</td>
                      <td className="px-4 py-3">
                        <div>{r.email}</div>
                        <div className="text-xs text-muted-foreground">{r.phone}</div>
                      </td>
                      <td className="px-4 py-3">{r.program ?? <span className="text-muted-foreground">—</span>}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setSelected(r)} className="text-sm text-primary hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">{selected.name}</h2>
                <p className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-xs font-semibold uppercase text-muted-foreground">Email</dt><dd><a className="text-primary hover:underline" href={`mailto:${selected.email}`}>{selected.email}</a></dd></div>
              <div><dt className="text-xs font-semibold uppercase text-muted-foreground">Phone</dt><dd><a className="text-primary hover:underline" href={`tel:${selected.phone}`}>{selected.phone}</a></dd></div>
              <div><dt className="text-xs font-semibold uppercase text-muted-foreground">Program</dt><dd>{selected.program ?? "—"}</dd></div>
              <div><dt className="text-xs font-semibold uppercase text-muted-foreground">Message</dt><dd className="whitespace-pre-wrap">{selected.message ?? "—"}</dd></div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}