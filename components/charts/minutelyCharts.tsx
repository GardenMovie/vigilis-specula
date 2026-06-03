"use client"

import { useEffect, useState } from "react"
import SingleLineChart from "./singleLineChart"
import TooMany429 from "@/components/shared/errors/tooMany429"
import { useHostname } from "@/components/shared/hostnameProvider"

export const description = "A multiple line chart"

type MetricPoint = { ts: number | null, value: number }
type MinutelyData = {
  cpu: MetricPoint[]
  ram: MetricPoint[]
  disk: MetricPoint[]
  ping: MetricPoint[]
}

let minutelyCache: MinutelyData | null = null
let minutelyCacheUpdatedAt = 0
let minutelyCachedHostname = ""
const CACHE_MAX_AGE_MS = 60 * 1000

export function MinutelyCharts() {
  const { hostname } = useHostname()
  const [chartData, setChartData] = useState<MinutelyData | null>(null)
  const [rateLimitError, setRateLimitError] = useState(false)

  useEffect(() => {
    if (hostname !== minutelyCachedHostname) {
      minutelyCache = null
    }
    if (minutelyCache) {
      setChartData(minutelyCache)
    }

    const fetchData = () => {
      fetch(`/api/charts/minutely?limit=60&hostname=${hostname}`)
        .then(res => res.json())
        .then((data) => {
          if (data && typeof data === "object" && data.error === "Rate limit exceeded") {
            setRateLimitError(true)
            setChartData(null)
            return
          }
          setRateLimitError(false)
          minutelyCache = data
          minutelyCacheUpdatedAt = Date.now()
          minutelyCachedHostname = hostname
          setChartData(data)
        })
    }
    const shouldFetch = !minutelyCache || Date.now() - minutelyCacheUpdatedAt >= CACHE_MAX_AGE_MS
    if (shouldFetch) {
      fetchData()
    }
    const interval = setInterval(fetchData, 60000) // 60,000 ms = 1 minute
    return () => clearInterval(interval)
  }, [hostname])


  if (rateLimitError) {
    return <TooMany429 />
  }

  if (!chartData) return <div>Loading...</div>

  return (
    <>
      <div className=""><SingleLineChart chartData={chartData.cpu} title="CPU Usage (%)" color="var(--color-lime-500)" /></div>
      <div className=""><SingleLineChart chartData={chartData.ram} title="RAM Usage (%)" color="var(--color-amber-500)" /></div>
      <div className=""><SingleLineChart chartData={chartData.disk} title="Disk Usage (%)" color="var(--color-emerald-500)" /></div>
      <div className=""><SingleLineChart chartData={chartData.ping} title="Ping (ms)" color="var(--color-cyan-500)" /></div>
    </>
  )
}
