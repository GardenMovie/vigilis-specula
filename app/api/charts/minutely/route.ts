import rateLimit from "next-rate-limit"
import { NextRequest, NextResponse } from "next/server"
import { getClient } from "@/lib/mongodb"

// Centralized rate limit per user (requests per interval)
const RATE_LIMIT_PER_USER = 10
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 50 // Max 500 users per minute
})

export async function GET(request: NextRequest) {
  try {
    // Rate limit: RATE_LIMIT_PER_USER requests per minute per user
    const headers = limiter.checkNext(request, RATE_LIMIT_PER_USER)

    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "60", 10), 360)
    const hostname = url.searchParams.get("hostname")?.trim() || "heweyDeb"
    if (!/^[a-zA-Z0-9.-]{1,64}$/.test(hostname)) {
      return NextResponse.json({ error: "Invalid hostname" }, { status: 400 })
    }
    const client = await getClient()
    const db = client.db("Metrics")
    const coll = db.collection("hardwareMin")
    const docs = await coll.find({"metadata.hostname": hostname}).sort({ timestamp: -1 }).limit(limit).toArray()

    // Prepare 4 arrays for each metric
    type MetricPoint = { ts: number | null, value: number }
    const cpu: MetricPoint[] = []
    const ram: MetricPoint[] = []
    const disk: MetricPoint[] = []
    const ping: MetricPoint[] = []

    docs.forEach((d: any) => {
      const ts = d.timestamp
      cpu.push({ ts, value: Number(d.fields?.cpu_percent ?? 0) })
      ram.push({ ts, value: Number(d.fields?.ram_percent ?? 0) })
      disk.push({ ts, value: Number(d.fields?.disk_percent ?? 0) })
      ping.push({ ts, value: Number(d.fields?.ping_ms ?? 0) })
    })

    return NextResponse.json({ cpu, ram, disk, ping }, { headers })
  } catch {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }
}
