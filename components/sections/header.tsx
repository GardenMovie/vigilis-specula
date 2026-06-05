import { HelpCircle } from "lucide-react"
import Link from "next/link"

export function SectionHeader() {
  return (
    <div className="sticky top-0 z-50 w-full bg-background/30 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
      <div className="md:w-[60%] mx-auto px-4 py-2 flex items-stretch justify-between">
        <Link href="/" className="inline-flex items-center px-4 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <h1 className="text-3xl text-zinc-900 hover:text-blue-600 dark:text-zinc-100 whitespace-nowrap leading-none" style={{ fontFamily: 'var(--font-alex-brush)' }}>
            Vigilis
          </h1>
        </Link>
        <Link href="/about" className="text-md font-normal inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          About
          <HelpCircle className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
