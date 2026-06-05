import rateLimit from "next-rate-limit"
import { NextRequest, NextResponse } from "next/server"
import { getClient } from "@/lib/mongodb"


// Centralized rate limit per user (requests per interval)
const RATE_LIMIT_PER_USER = 3

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 50 // Max 500 users per minute
})

export async function GET(request: NextRequest) {
  try {
    // Rate limit: RATE_LIMIT_PER_USER requests per minute per user
    const headers = limiter.checkNext(request, RATE_LIMIT_PER_USER)

    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "30", 10), 90)
    const hostname = url.searchParams.get("hostname")?.trim() || "heweyDeb";
    if (!/^[a-zA-Z0-9.-]{1,64}$/.test(hostname)) {
      return NextResponse.json({ error: "Invalid hostname" }, { status: 400 });
    }
    const client = await getClient()
    const db = client.db("Metrics")
    const coll = db.collection("hardwareDay")
    const docs = await coll.find({ "metadata.hostname": hostname, timestamp: { $lte: new Date() } }).sort({ timestamp: -1 }).limit(limit).toArray()

    const result = docs.map((d: any) => {
      const ts = d.timestamp
      const avgCpu = Number(d.fields?.avgCpu ?? 0)
      const maxCpu = Number(d.fields?.maxCpu ?? 0)
      const minCpu = Number(d.fields?.minCpu ?? 0)
      const avgRam = Number(d.fields?.avgRam ?? 0)
      const maxRam = Number(d.fields?.maxRam ?? 0)
      const minRam = Number(d.fields?.minRam ?? 0)
      const avgPing = Number(d.fields?.avgPing ?? 0)
      const maxPing = Number(d.fields?.maxPing ?? 0)
      const disk = Number(d.fields?.storageSpace ?? 0)

      return {
        ts,
        avgCpu,
        maxCpu,
        minCpu,
        avgRam,
        maxRam,
        minRam,
        disk,
        avgPing,
        maxPing
      }
    })
    return NextResponse.json(result, { headers })
  } catch {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }
}
