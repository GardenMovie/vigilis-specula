import { HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export function SectionHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/30 backdrop-blur">
      <nav className="flex md:w-[60%] mx-auto h-14 py-2.5 px-4 items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="w-auto px-3 h-full hover:text-blue-500"
          aria-label="Home"
        >
          <a
            href="/"
            className="text-muted-foreground flex items-center"
            style={{ fontFamily: "var(--font-alex-brush)", fontSize: "1.6rem" }}
            title="Home"
          >
            Vigilis
          </a>
        </Button>
        <Button
          variant="outline"
          asChild
          className="w-auto px-3 h-full gap-1.5"
        >
          <a href="/about"
            className="text-muted-foreground hover:text-orange-400 aspect-square"
            style={{ fontSize: "1.0rem"}}
            title="About">
            <HelpCircle className="size-4" />
          </a>
        </Button>
      </nav>
    </header>
  )
}
