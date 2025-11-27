"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
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
  const transitionTimerRef = useRef<number | null>(null)

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

    // clear any existing timer before creating a new one
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current)
    }

    // store timer id so we can clear it on unmount to avoid setState-after-unmount
    transitionTimerRef.current = window.setTimeout(() => {
      setShowPortfolio(true)
      // clear the ref after callback runs
      transitionTimerRef.current = null
    }, 500) as unknown as number
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

  // cleanup any outstanding transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current)
        transitionTimerRef.current = null
      }
    }
  }, [])

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
      className={cn("min-h-screen relative", isTransitioning && "animate-fade-in-portfolio")}
      data-testid="portfolio-root"
    >
      {mainBackgroundMode === "keyboard" ? <KeyboardBackgroundClient /> : null}
      <div className="relative z-10">{children}</div>
    </main>
  )
}
