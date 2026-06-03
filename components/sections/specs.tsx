"use client"
import { useEffect, useState } from "react"
import TooMany429 from "../shared/errors/tooMany429"
import { Monitor, MemoryStick, HardDrive, Cpu, Gpu } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"


let specsCache: specsData | null = null
let specsCacheUpdatedAt = 0
const SPECS_CACHE_MAX_AGE_MS = 60 * 60 * 1000 * 24 * 10

type specsData = {
  hostname: string
  cpu: string
  gpu: string
  ram: string
  disk: string
}


export function Specs() {

  const [rateLimitError, setRateLimitError] = useState(false)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    //if (specsCache) {
    //  setData(specsCache)
    //}

    const fetchSpecs = () => {
      fetch("/api/hosts?hostname=hewey-deb")
        .then(res => res.json())
        .then(data => {
          if (data && typeof data === "object" && data.error === "Rate limit exceeded") {
            setRateLimitError(true)
            setData(null)
            return
          }
          setRateLimitError(false)

          const specs: specsData = {
            hostname: data[0]?.hostname || "Unknown Host",
            cpu: data[0]?.cpu || "Unknown CPU",
            gpu: data[0]?.gpu || "Unknown GPU",
            ram: data[0]?.ram + " GB" || "Unknown RAM",
            disk: data[0]?.disk + " GB" || "Unknown Disk"
          }
          specsCache = specs
          specsCacheUpdatedAt = Date.now()
          setData(specs)
        }
        )
    }
    const shouldFetch = !specsCache || Date.now() - specsCacheUpdatedAt >= SPECS_CACHE_MAX_AGE_MS
    if (shouldFetch) {
      fetchSpecs()
    }
  })

  return (
    <div className="w-full aspect-5/1:md mb-6 grid md:grid-cols-3 gap-3">
      <Card className="col-span-2 row-span-1 md:col-span-1 md:row-span-2">
        <CardContent className="flex flex-col items-center flex-1 justify-center">
          <Monitor className="w-8 h-8 mb-1 text-blue-600" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-100 text-center">{data?.hostname}</span>
        </CardContent>
      </Card>

      <Card className="">
        <CardContent className="flex flex-col items-center flex-1 justify-center">
          <Cpu className="w-8 h-8 mb-1 text-green-600" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-100 text-center">{data?.cpu}</span>
        </CardContent>
      </Card>
      <Card className="">
        <CardContent className="flex flex-col items-center flex-1 justify-center">
          <Gpu className="w-8 h-8 mb-1 text-red-600" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-100 text-center">{data?.gpu}</span>
        </CardContent>
      </Card>
      <Card className="">
        <CardContent className="flex flex-col items-center flex-1 justify-center">
          <MemoryStick className="w-8 h-8 mb-1 text-amber-600" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-100 text-center">{data?.ram}</span>
        </CardContent>
      </Card>
      <Card className="">
        <CardContent className="flex flex-col items-center flex-1 justify-center">
          <HardDrive className="w-8 h-8 mb-1 text-emerald-600" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-100 text-center">{data?.disk}</span>
        </CardContent>
      </Card>
    </div>
  )
}
