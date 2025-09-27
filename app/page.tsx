"use client"

import { useState, useEffect } from "react"
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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [keyboardFadingOut, setKeyboardFadingOut] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  // Show keyboard with fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyboardVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleCorrectEntry = () => {
    setIsTransitioning(true)
    setKeyboardFadingOut(true)
    
    // After keyboard fades out, show portfolio with fade in
    setTimeout(() => {
      setShowPortfolio(true)
    }, 500) // Slightly faster for more seamless feel
  }

  // Reset transition state when portfolio is shown
  useEffect(() => {
    if (showPortfolio) {
      setTimeout(() => {
        setIsTransitioning(false)
        setKeyboardFadingOut(false)
      }, 700) // Adjusted timing for smoother feel
    }
  }, [showPortfolio])

  // Show keyboard landing page (with fade in and possible fade out animation)
  if (!showPortfolio) {
    return (
      <div className={`
        ${keyboardFadingOut ? 'animate-fade-out' : ''}
        ${keyboardVisible && !keyboardFadingOut ? 'animate-fade-in-keyboard' : 'opacity-0'}
      `}>
        <KeyboardLanding onCorrectEntry={handleCorrectEntry} />
      </div>
    )
  }

  // Show portfolio page (with fade in animation)
  return (
    <main className={`min-h-screen bg-black relative ${isTransitioning ? 'animate-fade-in-portfolio' : ''}`}>
      {/* Conditional Keyboard Background */}
      {MAIN_BACKGROUND_MODE === 'keyboard' && <KeyboardBackground />}
      
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
