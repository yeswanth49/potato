"use client"

import { useState, useEffect, type ReactNode } from "react"
import dynamic from "next/dynamic"

import { KeyboardLanding } from "@/components/keyboard-landing"
import { cn } from "@/lib/utils"

const KeyboardBackgroundClient = dynamic(
  () => import("@/components/keyboard-background").then((mod) => ({ default: mod.KeyboardBackground })),
  { ssr: false },
)

interface LandingShellProps {
  children: ReactNode
  mainBackgroundMode?: "dark" | "keyboard"
  showLandingOnLoad?: boolean
}

export function LandingShell({
  children,
  mainBackgroundMode = "dark",
  showLandingOnLoad = true,
}: LandingShellProps) {
  const [showPortfolio, setShowPortfolio] = useState(!showLandingOnLoad)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [keyboardFadingOut, setKeyboardFadingOut] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    if (showPortfolio) return

    const timer = window.setTimeout(() => {
      setKeyboardVisible(true)
    }, 100)

    return () => {
      window.clearTimeout(timer)
    }
  }, [showPortfolio])

  const handleCorrectEntry = () => {
    setIsTransitioning(true)
    setKeyboardFadingOut(true)

    window.setTimeout(() => {
      setShowPortfolio(true)
    }, 500)
  }

  useEffect(() => {
    if (!showPortfolio) return

    const timer = window.setTimeout(() => {
      setIsTransitioning(false)
      setKeyboardFadingOut(false)
    }, 700)

    return () => {
      window.clearTimeout(timer)
    }
  }, [showPortfolio])

  if (!showPortfolio) {
    return (
      <div
        className={cn(
          keyboardFadingOut && "animate-fade-out",
          keyboardVisible && !keyboardFadingOut ? "animate-fade-in-keyboard" : "opacity-0",
        )}
      >
        <KeyboardLanding onCorrectEntry={handleCorrectEntry} backgroundMode={mainBackgroundMode} />
      </div>
    )
  }

  return (
    <main
      className={cn("min-h-screen bg-black relative", isTransitioning && "animate-fade-in-portfolio")}
      data-testid="portfolio-root"
    >
      {mainBackgroundMode === "keyboard" ? <KeyboardBackgroundClient /> : null}
      <div className="relative z-10">{children}</div>
    </main>
  )
}
