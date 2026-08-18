"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type MetricPoint = {
  ts: number | null;
  avg: number;
  min?: number | null;
  max?: number | null;
}

const chartConfig = {
  avg: {
    label: "This",
    color: "var(--chart-1)",
  },
  min: {
    label: "Min",
    color: "var(--chart-2)",
  },
  max: {
    label: "Max",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export default function MultiLineChart({ chartData, title = "Metric Usage", description = "Metric over time", colors = {}, tickInterval = "hour" }: {
  chartData: MetricPoint[],
  title?: string,
  description?: string,
  colors?: { avg?: string, min?: string, max?: string },
  tickInterval?: "hour" | "day"
}) {
  const data = (chartData ?? [])
    .map((d) => ({
      ts: typeof d.ts === "number" ? d.ts : d.ts ? new Date(d.ts).getTime() : null,
      avg: d.avg,
      min: d.min,
      max: d.max,
    }))
    .filter((d) => d.ts != null)
    .sort((a, b) => (a.ts as number) - (b.ts as number))

  const isDay = tickInterval === "day"

  // Generate an array of ticks (hourly or daily) between dataMin and dataMax
  let ticks: number[] = [];
  if (data.length > 0) {
    const min = data[0].ts as number;
    const max = data[data.length - 1].ts as number;
    const start = new Date(min);
    if (isDay) {
      start.setHours(0, 0, 0, 0);
      let t = start.getTime();
      while (t <= max) {
        ticks.push(t);
        t += 24 * 60 * 60 * 1000; // add 1 day
      }
    } else {
      start.setMinutes(0, 0, 0);
      let t = start.getTime();
      while (t <= max) {
        ticks.push(t);
        t += 60 * 60 * 1000; // add 1 hour
      }
    }
  }

  // Check if min/max exist in any data point
  const hasMin = data.some(d => d.min !== undefined && d.min !== null)
  const hasMax = data.some(d => d.max !== undefined && d.max !== null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}  className="aspect-3/1 md:aspect-5/1 w-full">
            <LineChart accessibilityLayer data={data} margin={{ left: -20, right: 12, bottom: isDay ? 16 : 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="ts"
                type="number"
                tickLine={true}
                axisLine={true}
                tickMargin={isDay ? 6 : 8}
                interval={0}
                height={isDay ? 44 : undefined}
                domain={["dataMin", "dataMax"]}
                ticks={ticks}
                tickFormatter={(t) => {
                  const date = new Date(Number(t));
                  if (isDay) {
                    const dd = String(date.getDate()).padStart(2, "0");
                    const mm = String(date.getMonth() + 1).padStart(2, "0");
                    return `${dd}/${mm}`;
                  } else {
                    return date.toLocaleTimeString([], {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }
                }}
                minTickGap={0}
                tick={isDay
                  ? { fontSize: 10, angle: -90, textAnchor: "end", dy: 4 }
                  : { fontSize: 12 }}
              />
              <YAxis
                domain={[
                  0,
                  (dataMax: number) => dataMax > 100 ? Number((dataMax * 1.2).toFixed(2)) : 100,
                ]}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent
                  labelKey="ts"
                  labelFormatter={(_, payload) => {
                    let ts = payload && payload[0] && payload[0].payload && payload[0].payload.ts;
                    ts = Number(ts);
                    return !isNaN(ts) && ts > 0
                      ? new Date(ts).toLocaleString()
                      : String(ts);
                  }}
                />}
              />
              <Line
                dataKey="avg"
                type="monotone"
                stroke={colors.avg || chartConfig.avg.color}
                strokeWidth={1}
                dot={true}
                activeDot={{ r: 2 }}
                name="Avg"
              />
              {hasMin && (
                <Line
                  dataKey="min"
                  type="monotone"
                  stroke={colors.min || chartConfig.min.color}
                  strokeWidth={1}
                  dot={true}
                  activeDot={{ r: 2 }}
                  name="Min"
                />
              )}
              {hasMax && (
                <Line
                  dataKey="max"
                  type="monotone"
                  stroke={colors.max || chartConfig.max.color}
                  strokeWidth={1}
                  dot={true}
                  activeDot={{ r: 2 }}
                  name="Max"
                />
              )}
            </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
