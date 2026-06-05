import rateLimit from "next-rate-limit"
import { NextRequest, NextResponse } from "next/server"
import { getClient } from "@/lib/mongodb"

const RATE_LIMIT_PER_USER = 3
const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 50
})

export async function GET(request: NextRequest) {
  try {
    const headers = limiter.checkNext(request, RATE_LIMIT_PER_USER)
    const client = await getClient()
    const db = client.db("Hosts")
    const coll = db.collection("specifications")
    const hostnames = await coll.distinct("hostname")
    return NextResponse.json(hostnames, { headers })
  } catch {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }
}
