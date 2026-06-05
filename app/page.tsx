"use client"

import { Button } from "@/components/ui/button"
import { Specs } from "@/components/sections/specs"
import { SectionHeader } from "@/components/sections/header"
import { ChartsSection } from "@/components/sections/charts"
import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ButtonGroup } from "@/components/ui/button-group"

export default function Page() {
  return (
    <div>
    <SectionHeader />
    <div className="md:w-[60%] mx-auto p-4">
      <Specs />
      <ChartsSection />
    </div>
    </div>
  )
}
