
"use client"
import { useEffect, useState } from "react"
import LineChartClient from "./multiLineChart"
import TooMany429 from "@/components/shared/errors/tooMany429"
import { useHostname } from "@/components/shared/hostnameProvider"

export const description = "A multiple line chart for daily data"

type MetricPoint = {
  ts: number | null;
  avg: number;
  min?: number | null;
  max?: number | null;
};
type DailyData = {
  cpu: MetricPoint[];
  ram: MetricPoint[];
  disk: MetricPoint[];
  ping: MetricPoint[];
  };

let dailyCache: DailyData | null = null
let dailyCacheUpdatedAt = 0
let dailyCachedHostname = ""
const DAILY_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000


export function DailyCharts() {
  const { hostname } = useHostname()
  const [chartData, setChartData] = useState<DailyData | null>(null)
  const [rateLimitError, setRateLimitError] = useState(false)

  useEffect(() => {
    if (hostname !== dailyCachedHostname) {
      dailyCache = null
    }
    if (dailyCache) {
      setChartData(dailyCache)
    }

    const fetchData = () => {
      fetch(`/api/charts/daily?limit=30&hostname=${hostname}`)
        .then(res => res.json())
        .then((data) => {
          if (data && typeof data === "object" && data.error === "Rate limit exceeded") {
            setRateLimitError(true)
            setChartData(null)
            return
          }
          setRateLimitError(false)
          if (!Array.isArray(data)) return
          // Transform the array of objects into arrays for each metric
          const metrics: DailyData = {
            cpu: [],
            ram: [],
            disk: [],
            ping: []
          }
          data.reverse().forEach((d: any) => {
            metrics.cpu.push({ ts: d.ts, avg: d.avgCpu, min: d.minCpu ?? undefined, max: d.maxCpu ?? undefined })
            metrics.ram.push({ ts: d.ts, avg: d.avgRam, min: d.minRam ?? undefined, max: d.maxRam ?? undefined })
            metrics.disk.push({ ts: d.ts, avg: d.disk, min: d.minDisk ?? undefined, max: d.maxDisk ?? undefined })
            metrics.ping.push({ ts: d.ts, avg: d.avgPing, min: d.minPing ?? undefined, max: d.maxPing ?? undefined })
          })
          dailyCache = metrics
          dailyCacheUpdatedAt = Date.now()
          dailyCachedHostname = hostname
          setChartData(metrics)
        })
    }
    const shouldFetch = !dailyCache || Date.now() - dailyCacheUpdatedAt >= DAILY_CACHE_MAX_AGE_MS
    if (shouldFetch) {
      fetchData()
    }
    const interval = setInterval(fetchData, 60000 * 60 * 24)
    return () => clearInterval(interval)
  }, [hostname])

  if (rateLimitError) {
    return <TooMany429 />
  }

  if (!chartData) return <div>Loading...</div>

  return (
    <>
      <div className="w-full h-full"><LineChartClient 
        chartData={chartData.cpu} 
        title="CPU Usage (%)" 
        tickInterval="day"
        colors={{ avg: "var(--color-lime-500)", min: "var(--color-lime-300)", max: "var(--color-lime-700)" }} /></div>
      <div 
        className="w-full h-full"><LineChartClient 
        chartData={chartData.ram} title="RAM Usage (%)" 
        tickInterval="day"
        colors={{ avg: "var(--color-amber-500", min: "var(--color-amber-300", max: "var(--color-amber-700)" }} /></div>
      <div 
        className="w-full h-full"><LineChartClient 
        chartData={chartData.disk} title="Disk Usage (%)" 
        tickInterval="day"
        colors={{ avg: "var(--color-emerald-500", min: "var(--color-emerald-300", max: "var(--color-emerald-700)" }} /></div>
      <div 
        className="w-full h-full"><LineChartClient 
        chartData={chartData.ping} title="Ping (ms)"
        tickInterval="day"
        colors={{ avg: "var(--color-cyan-500", min: "var(--color-cyan-300", max: "var(--color-cyan-700)" }} /></div>
    </>
  )
}
