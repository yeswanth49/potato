"use client"

import { useState } from "react"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { Skills } from "@/components/skills"
import { HireMe } from "@/components/hire-me"
import { Contact } from "@/components/contact"
import { Navigation } from "@/components/navigation"
import { KeyboardBackground } from "@/components/keyboard-background"
import { KeyboardLanding } from "@/components/keyboard-landing"

export default function Home() {
  const [showPortfolio, setShowPortfolio] = useState(false)

  if (!showPortfolio) {
    return <KeyboardLanding onCorrectEntry={() => setShowPortfolio(true)} />
  }

  return (
    <main className="min-h-screen bg-black relative">
      {/* Keyboard Background */}
      <KeyboardBackground />
      
      {/* Main Content with higher z-index */}
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <HireMe />
        <Contact />
      </div>
    </main>
  )
}
