"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
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
  // 🎨 MAIN PAGE BACKGROUND TOGGLE: Change this to control keyboard background on portfolio page
  // Set to 'dark' for no keyboard background, 'keyboard' for animated keyboard background
  const MAIN_BACKGROUND_MODE = 'dark' as 'dark' | 'keyboard' // <- Change this value to toggle

  const [showPortfolio, setShowPortfolio] = useState(false)

  return (
    <AnimatePresence mode="wait">
      {!showPortfolio ? (
        <motion.div
          key="keyboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ ease: "easeInOut", duration: 0.4 }}
        >
          <KeyboardLanding onCorrectEntry={() => setShowPortfolio(true)} />
        </motion.div>
      ) : (
        <motion.main
          key="portfolio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="min-h-screen bg-black relative"
        >
          {/* Conditional Keyboard Background */}
          {MAIN_BACKGROUND_MODE === 'keyboard' && <KeyboardBackground />}

          {/* Main Content with higher z-index */}
          <div className="relative z-10">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 0.6, delay: 0.5 }}
            >
              <Navigation />
            </motion.div>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <HireMe />
            <Contact />
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  )
}
