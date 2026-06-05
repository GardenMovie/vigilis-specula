import { Card, CardContent } from "@/components/ui/card"

export function SectionHeader() {
  return (
    <Card className="mb-6">
      <CardContent>
        <h1 className="text-5xl text-center text-zinc-900 dark:text-zinc-100" style={{ fontFamily: 'var(--font-alex-brush)' }}>
          Vigilis
        </h1>
      </CardContent>
    </Card>
  )
}
