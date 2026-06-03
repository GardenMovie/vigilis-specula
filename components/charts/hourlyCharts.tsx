"use client"

import { useEffect, useState } from "react"
import MultiLineChart from "./multiLineChart"
import TooMany429 from "@/components/shared/errors/tooMany429"
import { useHostname } from "@/components/shared/hostnameProvider"

export const description = "A multiple line chart for hourly data"

type MetricPoint = {
  ts: number | null;
  avg: number;
  min?: number | null;
  max?: number | null;
};
type HourlyData = {
  cpu: MetricPoint[];
  ram: MetricPoint[];
  disk: MetricPoint[];
  ping: MetricPoint[];
};

let hourlyCache: HourlyData | null = null
let hourlyCacheUpdatedAt = 0
let hourlyCachedHostname = ""
const HOURLY_CACHE_MAX_AGE_MS = 60 * 60 * 1000

export function HourlyCharts() {
  const { hostname } = useHostname()
  const [chartData, setChartData] = useState<HourlyData | null>(null)
  const [rateLimitError, setRateLimitError] = useState(false)

  useEffect(() => {
    if (hostname !== hourlyCachedHostname) {
      hourlyCache = null
    }
    if (hourlyCache) {
      setChartData(hourlyCache)
    }

    const fetchData = () => {
      fetch(`/api/charts/hourly?limit=24&hostname=${hostname}`)
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
          const metrics: HourlyData = {
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
          hourlyCache = metrics
          hourlyCacheUpdatedAt = Date.now()
          hourlyCachedHostname = hostname
          setChartData(metrics)
        })
    }
    const shouldFetch = !hourlyCache || Date.now() - hourlyCacheUpdatedAt >= HOURLY_CACHE_MAX_AGE_MS
    if (shouldFetch) {
      fetchData()
    }
    const interval = setInterval(fetchData, 60000 * 60)
    return () => clearInterval(interval)
  }, [hostname])


  if (rateLimitError) {
    return <TooMany429 />
  }

  if (!chartData) return <div>Loading...</div>

  return (
    <>
      <div className="w-full h-full"><MultiLineChart 
        chartData={chartData.cpu} 
        title="CPU Usage (%)" 
        colors={{ avg: "var(--color-lime-500)", min: "var(--color-lime-300)", max: "var(--color-lime-700)" }} /></div>
      <div 
        className="w-full h-full"><MultiLineChart 
        chartData={chartData.ram} 
        title="RAM Usage (%)" 
        colors={{ avg: "var(--color-amber-500", min: "var(--color-amber-300", max: "var(--color-amber-700)" }} /></div>
      <div 
        className="w-full h-full"><MultiLineChart 
        chartData={chartData.disk} 
        title="Disk Usage (%)" 
        colors={{ avg: "var(--color-emerald-500", min: "var(--color-emerald-300", max: "var(--color-emerald-700)" }} /></div>
      <div 
        className="w-full h-full"><MultiLineChart 
        chartData={chartData.ping} 
        title="Ping (ms)"
        colors={{ avg: "var(--color-cyan-500", min: "var(--color-cyan-300", max: "var(--color-cyan-700)" }} /></div>
    </>
  )
}
