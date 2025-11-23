"use client"

import dynamic from "next/dynamic"

import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"



const HireMeSection = dynamic(() => import("@/components/hire-me").then((mod) => ({ default: mod.HireMe })), {
  ssr: false,
  loading: () => (
    <section id="hire-me" className="px-4">
      <div className="max-w-6xl mx-auto">
        <div className="h-96 rounded-2xl border border-dashed border-border/60 bg-muted/20 animate-pulse" />
      </div>
    </section>
  ),
})

export function PortfolioContent() {
  return (
    <div className="relative flex flex-col">
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Projects />

      <HireMeSection />

    </div>
  )
}
