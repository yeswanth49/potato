"use client"

import dynamic from "next/dynamic"

import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"



const ContactSection = dynamic(() => import("@/components/contact").then((mod) => ({ default: mod.Contact })), {
  ssr: false,
  loading: () => (
    <section id="contact" className="px-4">
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

      <ContactSection />

    </div>
  )
}
