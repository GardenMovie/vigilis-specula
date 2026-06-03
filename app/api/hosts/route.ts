import rateLimit from "next-rate-limit"
import { NextRequest, NextResponse } from "next/server"
import { getClient } from "@/lib/mongodb"


// Centralized rate limit per user (requests per interval)
const RATE_LIMIT_PER_USER = 1000

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 50 // Max 500 users per minute
})

export async function GET(request: NextRequest) {
  try {
    // Rate limit: RATE_LIMIT_PER_USER requests per minute per user
    const headers = limiter.checkNext(request, RATE_LIMIT_PER_USER)

    const url = new URL(request.url)
    const hostname = url.searchParams.get("hostname")?.trim() || "hewey-deb";
    if (!/^[a-zA-Z0-9.-]{1,64}$/.test(hostname)) {
      return NextResponse.json({ error: "Invalid hostname" }, { status: 400 });
    }
    const client = await getClient()
    const db = client.db("Hosts")
    const coll = db.collection("specifications")
    const docs = await coll.find({"hostname": hostname}).limit(1).toArray()

    const result = docs.map((d: any) => {
      const hostname = d.hostname || "Unknown Host"
      const cpu = d.fields?.cpuModel || "Unknown CPU"
      const gpu = d.fields?.gpuModel || "Unknown GPU"
      const ram = d.fields?.ramCapacity || "Unknown RAM"
      const disk = d.fields?.diskCapacity || "Unknown Disk"
      return { hostname, cpu, gpu, ram, disk }
    })

    return NextResponse.json(result, { headers })
  } catch {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }
}
