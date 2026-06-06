import { SectionHeader } from "@/components/sections/header"
import { Server, Database, ArrowUpRight, RefreshCw, Terminal, Globe, BarChart2 } from "lucide-react"

const accent = {
  lime: "text-lime-500",
  amber: "text-amber-500",
  emerald: "text-emerald-500",
  cyan: "text-cyan-500",
  blue: "text-blue-500"
}

export default function AboutPage() {
  return (
    <div>
      <SectionHeader />
      <div className="md:w-[60%] mx-auto p-4 py-10 space-y-9">

        {/* Hero */}
        <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <h1 className="text-6xl text-zinc-900 dark:text-zinc-100 leading-none flex items-baseline gap-2">
            <span className="text-4xl">What is</span>
            <span className="text-blue-500" style={{ fontFamily: "var(--font-alex-brush)" }}>Vigilis</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            A personal homelab monitoring dashboard. It tracks CPU, memory, disk, and network stats
            from my home servers and surfaces them here, in real time.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The name comes from Latin: <span className="italic">vigilis</span>, watchman.
          </p>
        </div>

        {/* Why it's built this way */}
        <div className="space-y-3 pl-4 border-l-2 border-amber-400 dark:border-amber-600">
          <h2 className="text-2xl font-semibold tracking-tight">Why it's built this way</h2>
          <p className="text-muted-foreground leading-relaxed">
            My homelab isn't reliably reachable from the outside. Instead of the dashboard pulling data from the servers,
            the servers push metrics out on a schedule. That flips the usual model: outbound traffic is always possible
            even when inbound isn't.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I deliberately picked MongoDB over a relational DB here. I already have a SQL project, and I wanted to work with
            a pure document store. MongoDB's time-series collections are a legitimate fit for this use case:
            each metric reading is just a timestamped document.
          </p>
        </div>

        {/* Data pipeline */}
        <div className="space-y-4 pl-4 border-l-2 border-emerald-400 dark:border-emerald-600">
          <h2 className="text-2xl font-semibold tracking-tight">Data pipeline</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">

            <div className="rounded-l-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-2 relative">
              <div className="flex items-center gap-2 text-sm font-medium">
                <RefreshCw className={`w-4 h-4 animate-spin [animation-duration:3s] ${accent.lime}`} />
                Raw (minutely)
              </div>
              <p className="text-sm text-muted-foreground">
                One document per minute, per host. Auto-deleted after 24 hours via a MongoDB TTL index, no cron job needed.
              </p>
              <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 items-center justify-center">
                <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>

            <div className="border-y border-zinc-200 dark:border-zinc-800 p-4 space-y-2 relative sm:border sm:border-l-0 sm:border-r-0">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Database className={`w-4 h-4 ${accent.amber}`} />
                Hourly rollups
              </div>
              <p className="text-sm text-muted-foreground">
                Raw documents are aggregated into hourly summaries: avg and max per metric. Kept for 30 days.
              </p>
              <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 items-center justify-center">
                <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>

            <div className="rounded-r-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <BarChart2 className={`w-4 h-4 ${accent.emerald}`} />
                Daily rollups
              </div>
              <p className="text-sm text-muted-foreground">
                Hourly rollups collapse into daily summaries. Long-term storage, you can see months of history at a glance.
              </p>
            </div>

          </div>
          <p className="text-sm text-muted-foreground">
            This tiered approach is the same pattern used in production observability systems like Datadog and Prometheus
            long-term storage. You don't need per-minute granularity for data that's a week old.
          </p>
        </div>

        {/* Stack */}
        <div className="space-y-4 pl-4 border-l-2 border-cyan-400 dark:border-cyan-600">
          <h2 className="text-2xl font-semibold tracking-tight">Stack</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900/50">
              <Terminal className={`w-4 h-4 mt-0.5 shrink-0 ${accent.lime}`} />
              <div>
                <p className="text-sm font-medium">Collection</p>
                <p className="text-sm text-muted-foreground">Systemd service runs a python script that collects and sends metrics to the database</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900/50">
              <Database className={`w-4 h-4 mt-0.5 shrink-0 ${accent.amber}`} />
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-sm text-muted-foreground">MongoDB Atlas, time-series collections with TTL indexes for auto-cleanup</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900/50">
              <Server className={`w-4 h-4 mt-0.5 shrink-0 ${accent.emerald}`} />
              <div>
                <p className="text-sm font-medium">API</p>
                <p className="text-sm text-muted-foreground">Next.js API routes, keeping MongoDB credentials server-side</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900/50">
              <Globe className={`w-4 h-4 mt-0.5 shrink-0 ${accent.cyan}`} />
              <div>
                <p className="text-sm font-medium">Frontend</p>
                <p className="text-sm text-muted-foreground">Next.js + Tailwind + Recharts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why I built it */}
        <div className="space-y-3 pl-4 border-l-2 border-lime-400 dark:border-lime-600 pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Why I built it</h2>
          <p className="text-muted-foreground leading-relaxed">
            Part curiosity, part learning. I wanted experience with a real NoSQL time-series workload, not a tutorial one.
            Running it against actual infrastructure means the data is real and the edge cases are real.
          </p>
        </div>

      </div>
    </div>
  )
}
