"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"

// Enhanced hint management types and interfaces
interface TypingPattern {
  timestamp: number
  key: string
  duration: number
}

interface HintState {
  currentHintIndex: number
  isVisible: boolean
  urgency: 'low' | 'medium' | 'high'
  adaptiveDelay: number
}

interface ProgressState {
  completedChars: number
  totalChars: number
  isComplete: boolean
}

const KeyboardBackgroundClient = dynamic(
  () => import("./keyboard-background").then((mod) => ({ default: mod.KeyboardBackground })),
  { ssr: false },
)

const KEYBOARD_LAYOUT = {
  numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  topRow: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  middleRow: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  bottomRow: ["Z", "X", "C", "V", "B", "N", "M"],
}

const TARGET_TEXT = "yesh"
const HINT_SEQUENCE = ["y", "e", "s", "h", "return"] as const
const MAX_HINT_ITERATIONS = 2

type HintKey = (typeof HINT_SEQUENCE)[number]

type KeyProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  children: React.ReactNode
  isPressed?: boolean
  size?: "sm" | "md" | "lg" | "xl"
}

function Key({ children, className, isPressed, size = "md", ...props }: KeyProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-sm",
    md: "w-14 h-14 text-base",
    lg: "w-20 h-14 text-base",
    xl: "w-96 h-14 text-base",
  } as const

  return (
    <button
      {...props}
      type="button"
      className={cn(
        "rounded-lg border border-[#1A1B1C] bg-gradient-to-b from-[#090A0B] to-[#0E0E10] text-gray-300 font-medium",
        "relative before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-b before:from-[#1A1B1C] before:to-[#141415] before:-z-10",
        "hover:from-[#0A0B0C] hover:to-[#0F0F11] active:from-[#080909] active:to-[#0D0D0F] transition-all duration-150",
        "flex items-center justify-center select-none",
        isPressed && "from-[#080909] to-[#0D0D0F] scale-95",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </button>
  )
}

interface KeyboardLandingProps {
  onCorrectEntry: () => void
  backgroundMode?: "dark" | "keyboard"
}

export function KeyboardLanding({ onCorrectEntry, backgroundMode = "dark" }: KeyboardLandingProps) {
  const [text, setText] = useState("")
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [capsLock, setCapsLock] = useState(false)
  const [showError, setShowError] = useState(false)
  const [hintState, setHintState] = useState<HintState>({
    currentHintIndex: 0,
    isVisible: true,
    urgency: 'low',
    adaptiveDelay: 600
  })
  const [progressState, setProgressState] = useState<ProgressState>({
    completedChars: 0,
    totalChars: 4,
    isComplete: false
  })
  const [typingPatterns, setTypingPatterns] = useState<TypingPattern[]>([])
  const [lastKeyTime, setLastKeyTime] = useState<number>(0)

  const errorResetTimeout = useRef<number | null>(null)
  const isSubmittingRef = useRef(false)
  const hintTimeoutRef = useRef<number | null>(null)
  const typingStartTime = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (errorResetTimeout.current) {
        window.clearTimeout(errorResetTimeout.current)
        errorResetTimeout.current = null
      }
    }
  }, [])

  // Enhanced hint management system
  const calculateAdaptiveDelay = useCallback(() => {
    if (typingPatterns.length < 2) return 600

    const recentPatterns = typingPatterns.slice(-3)
    const avgDuration = recentPatterns.reduce((sum, pattern) => sum + pattern.duration, 0) / recentPatterns.length

    // Adaptive delay based on typing speed
    if (avgDuration < 100) return 400 // Fast typist
    if (avgDuration > 300) return 800 // Slow typist
    return 600 // Normal speed
  }, [typingPatterns])

  const updateProgressState = useCallback((newText: string) => {
    const completedChars = newText.length
    const isComplete = newText.toLowerCase() === TARGET_TEXT

    setProgressState({
      completedChars,
      totalChars: TARGET_TEXT.length,
      isComplete
    })

    // Update hint urgency based on progress
    let urgency: 'low' | 'medium' | 'high' = 'low'
    if (completedChars >= 3) urgency = 'high'
    else if (completedChars >= 2) urgency = 'medium'

    setHintState(prev => ({
      ...prev,
      urgency,
      adaptiveDelay: calculateAdaptiveDelay()
    }))
  }, [calculateAdaptiveDelay])

  const getContextualHint = useCallback(() => {
    const currentText = text.toLowerCase()
    const nextCharIndex = currentText.length

    if (nextCharIndex >= TARGET_TEXT.length) {
      return 'return' // Show enter when text is complete
    }

    return TARGET_TEXT[nextCharIndex]
  }, [text])

  useEffect(() => {
    updateProgressState(text)
  }, [text, updateProgressState])

  // Auto-hide hints when user completes the sequence successfully
  useEffect(() => {
    if (progressState.isComplete) {
      const hideTimeout = window.setTimeout(() => {
        setHintState(prev => ({
          ...prev,
          isVisible: false
        }))
      }, 1000)

      return () => window.clearTimeout(hideTimeout)
    } else {
      // Show hints when user starts typing
      setHintState(prev => ({
        ...prev,
        isVisible: true
      }))
    }
  }, [progressState.isComplete])

  // Enhanced typing pattern analysis for better adaptation
  useEffect(() => {
    if (typingPatterns.length < 5) return

    const recentPatterns = typingPatterns.slice(-5)
    const errorCount = recentPatterns.filter(p => p.key === 'ENTER_ERROR' || p.key === 'BACKSPACE').length
    const avgDuration = recentPatterns.reduce((sum, p) => sum + p.duration, 0) / recentPatterns.length

    // Adjust hint behavior based on user patterns
    if (errorCount > 2) {
      // User is struggling, make hints more prominent
      setHintState(prev => ({
        ...prev,
        urgency: 'high',
        adaptiveDelay: Math.max(400, prev.adaptiveDelay - 100)
      }))
    } else if (avgDuration < 150 && errorCount === 0) {
      // User is fast and accurate, reduce hint frequency
      setHintState(prev => ({
        ...prev,
        urgency: 'low',
        adaptiveDelay: prev.adaptiveDelay + 100
      }))
    }
  }, [typingPatterns])

  useEffect(() => {
    // Clear existing timeout
    if (hintTimeoutRef.current) {
      window.clearTimeout(hintTimeoutRef.current)
      hintTimeoutRef.current = null
    }

    if (!hintState.isVisible) return

    const contextualHint = getContextualHint()
    const hintIndex = HINT_SEQUENCE.indexOf(contextualHint as HintKey)

    if (hintIndex === -1) return

    setHintState(prev => ({
      ...prev,
      currentHintIndex: hintIndex,
      adaptiveDelay: calculateAdaptiveDelay()
    }))

    const scheduleNextHint = () => {
      hintTimeoutRef.current = window.setTimeout(() => {
        const nextHint = getContextualHint()
        const nextIndex = HINT_SEQUENCE.indexOf(nextHint as HintKey)

        if (nextIndex !== -1) {
          setHintState(prev => ({
            ...prev,
            currentHintIndex: nextIndex,
            adaptiveDelay: calculateAdaptiveDelay()
          }))
        }
      }, hintState.adaptiveDelay)
    }

    scheduleNextHint()

    return () => {
      if (hintTimeoutRef.current) {
        window.clearTimeout(hintTimeoutRef.current)
        hintTimeoutRef.current = null
      }
    }
  }, [text, hintState.isVisible, getContextualHint, calculateAdaptiveDelay, hintState.adaptiveDelay])

  const isKeyHighlighted = (key: string) => {
    const contextualHint = getContextualHint()
    if (contextualHint === "return") return false
    return key.toLowerCase() === contextualHint
  }

  const isReturnKeyGreen = () => {
    return progressState.isComplete && progressState.completedChars === TARGET_TEXT.length
  }

  const textRef = useRef(text)
  const capsLockRef = useRef(capsLock)
  const pressedKeysRef = useRef(pressedKeys)

  useEffect(() => {
    textRef.current = text
  }, [text])

  useEffect(() => {
    capsLockRef.current = capsLock
  }, [capsLock])

  useEffect(() => {
    pressedKeysRef.current = pressedKeys
  }, [pressedKeys])

  const handleKeyPress = useCallback(
    (key: string) => {
      const now = Date.now()

      if (key === "BACKSPACE") {
        setText((prev) => prev.slice(0, -1))
        setShowError(false)
        // Record typing pattern for backspace
        setTypingPatterns(prev => [...prev, {
          timestamp: now,
          key: "BACKSPACE",
          duration: now - lastKeyTime
        }])
        setLastKeyTime(now)
        return
      }

      if (key === "SPACE") {
        setText((prev) => prev + " ")
        setTypingPatterns(prev => [...prev, {
          timestamp: now,
          key: "SPACE",
          duration: now - lastKeyTime
        }])
        setLastKeyTime(now)
        return
      }

      if (key === "CAPS") {
        setCapsLock((prev) => !prev)
        return
      }

      // SHIFT is handled as a momentary key in pressedKeys state
      // No toggle action needed here

      if (key === "ENTER") {
        const currentText = textRef.current.toLowerCase()
        if (currentText === "yesh") {
          onCorrectEntry()
          // Record successful completion pattern
          setTypingPatterns(prev => [...prev, {
            timestamp: now,
            key: "ENTER_SUCCESS",
            duration: now - lastKeyTime
          }])
        } else {
          setShowError(true)
          setText("")
          // Record error pattern
          setTypingPatterns(prev => [...prev, {
            timestamp: now,
            key: "ENTER_ERROR",
            duration: now - lastKeyTime
          }])
          // clear any existing timeout before creating a new one
          if (errorResetTimeout.current) {
            window.clearTimeout(errorResetTimeout.current)
          }
          errorResetTimeout.current = window.setTimeout(() => {
            setShowError(false)
            errorResetTimeout.current = null
          }, 2000)
        }
        setLastKeyTime(now)
        return
      }

      if (key === "SHIFT") {
        return
      }

      const shouldUppercase = capsLockRef.current !== pressedKeysRef.current.has("SHIFT")
      const finalKey = shouldUppercase ? key.toUpperCase() : key.toLowerCase()

      // Record typing pattern for regular keys
      setTypingPatterns(prev => [...prev, {
        timestamp: now,
        key: finalKey,
        duration: now - lastKeyTime
      }])
      setLastKeyTime(now)

      setText((prev) => prev + finalKey)
      setShowError(false)

      // Update hint visibility based on typing activity
      setHintState(prev => ({
        ...prev,
        isVisible: true
      }))
    },
    [onCorrectEntry, lastKeyTime],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, target } = event
      const upperKey = key.toUpperCase()

      const isInteractiveTarget =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          Boolean(target.closest("[contenteditable]")))

      const handledKeys =
        upperKey === "BACKSPACE" ||
        upperKey === " " ||
        upperKey === "CAPSLOCK" ||
        upperKey === "SHIFT" ||
        upperKey === "ENTER" ||
        /^[A-Z0-9]$/.test(upperKey)

      if (handledKeys && !isInteractiveTarget) {
        event.preventDefault()
        setPressedKeys((prev) => new Set(prev).add(upperKey))

        if (upperKey === "BACKSPACE") {
          handleKeyPress("BACKSPACE")
          return
        }

        if (upperKey === " ") {
          handleKeyPress("SPACE")
          return
        }

        if (upperKey === "CAPSLOCK") {
          setCapsLock(event.getModifierState("CapsLock"))
          return
        }

        if (upperKey === "SHIFT") {
          handleKeyPress("SHIFT")
          return
        }

        if (upperKey === "ENTER") {
          if (isSubmittingRef.current) {
            return
          }
          handleKeyPress("ENTER")
          return
        }

        if (/^[A-Z0-9]$/.test(upperKey)) {
          handleKeyPress(upperKey)
        }
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const upperKey = event.key.toUpperCase()
      setPressedKeys((prev) => {
        const next = new Set(prev)
        next.delete(upperKey)
        return next
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleKeyPress])

  const backgroundClass = backgroundMode === "dark" ? "bg-black" : "bg-gray-900"

  return (
    <div className={cn("min-h-screen p-8 flex flex-col items-center justify-center gap-8 relative", backgroundClass)}>
      {backgroundMode === "keyboard" ? <KeyboardBackgroundClient /> : null}

      {/* removed empty spacer */}

      {showError ? (
        <div className="absolute top-1/3 z-20">
          <p className="text-red-400 text-xl animate-pulse font-light">Try again...</p>
        </div>
      ) : null}

      {/* Enhanced Progress Indicators */}
      {text.length > 0 && (
        <div className="absolute top-1/4 z-20 flex flex-col items-center gap-4">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700">
            <div className="text-sm font-mono text-gray-300">
              {text.split('').map((char, index) => (
                <span
                  key={index}
                  className={cn(
                    "transition-all duration-300",
                    index < progressState.completedChars
                      ? "text-white"
                      : "text-gray-500"
                  )}
                >
                  {char}
                </span>
              ))}
              {Array.from({ length: TARGET_TEXT.length - text.length }).map((_, index) => (
                <span key={`empty-${index}`} className="text-gray-600">
                  _
                </span>
              ))}
            </div>
            <div className="text-gray-500 text-sm">
              {progressState.completedChars}/{TARGET_TEXT.length}
            </div>
          </div>

          {/* Progress Bar Visual */}
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500 ease-out",
                progressState.isComplete
                  ? "bg-white"
                  : "bg-gray-400"
              )}
              style={{ width: `${(progressState.completedChars / TARGET_TEXT.length) * 100}%` }}
            />
          </div>

          {/* Next Character Hint */}
          {!progressState.isComplete && (
            <div className={cn(
              "px-3 py-1 rounded-full border text-sm font-mono transition-all duration-300",
              hintState.urgency === 'high'
                ? "bg-white/20 border-white text-white animate-pulse"
                : hintState.urgency === 'medium'
                ? "bg-gray-300/20 border-gray-300 text-gray-200"
                : "bg-gray-500/20 border-gray-400 text-gray-400"
            )}>
              Next: {getContextualHint().toUpperCase()}
            </div>
          )}
        </div>
      )}

      <div className="relative flex flex-col gap-2 p-8 bg-black rounded-2xl sm:scale-100 md:scale-125 lg:scale-150">
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-black to-transparent z-10 rounded-l-2xl pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-black to-transparent z-10 rounded-r-2xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-10 rounded-t-2xl pointer-events-none" />

        <div className="flex gap-2 justify-center">
          {KEYBOARD_LAYOUT.numbers.map((key) => (
            <Key
              key={key}
              onClick={() => handleKeyPress(key)}
              isPressed={pressedKeys.has(key) || isKeyHighlighted(key)}
              className={cn(
                "transition-all duration-300",
                isKeyHighlighted(key) && (
                  hintState.urgency === 'high'
                    ? "!border-white/80 !shadow-lg !shadow-white/60 !animate-pulse"
                    : hintState.urgency === 'medium'
                    ? "!border-gray-300 !shadow-lg !shadow-gray-300/60"
                    : "!border-white/60 !shadow-lg !shadow-white/50"
                )
              )}
            >
              {key}
            </Key>
          ))}
        </div>

        <div className="flex gap-2 justify-center">
          {KEYBOARD_LAYOUT.topRow.map((key) => (
            <Key
              key={key}
              onClick={() => handleKeyPress(key)}
              isPressed={pressedKeys.has(key) || isKeyHighlighted(key)}
            >
              {key}
            </Key>
          ))}
        </div>

        <div className="flex gap-2 justify-center">
          <Key
            onClick={() => handleKeyPress("CAPS")}
            isPressed={capsLock}
            size="lg"
            aria-pressed={capsLock}
            className={capsLock ? "bg-blue-600 hover:bg-blue-500" : undefined}
          >
            caps
          </Key>
          {KEYBOARD_LAYOUT.middleRow.map((key) => (
            <Key
              key={key}
              onClick={() => handleKeyPress(key)}
              isPressed={pressedKeys.has(key) || isKeyHighlighted(key)}
              className={cn(
                "transition-all duration-300",
                isKeyHighlighted(key) && (
                  hintState.urgency === 'high'
                    ? "!border-white/80 !shadow-lg !shadow-white/60 !animate-pulse"
                    : hintState.urgency === 'medium'
                    ? "!border-gray-300 !shadow-lg !shadow-gray-300/60"
                    : "!border-white/60 !shadow-lg !shadow-white/50"
                )
              )}
            >
              {key}
            </Key>
          ))}
          <Key
            onClick={() => handleKeyPress("ENTER")}
            isPressed={pressedKeys.has("ENTER")}
            size="lg"
            className={cn(
              "transition-all duration-300",
              isReturnKeyGreen()
                ? "!bg-white !text-black !border-white !shadow-lg !shadow-white/30"
                : progressState.completedChars === TARGET_TEXT.length - 1
                ? "!bg-gray-200 !text-black !border-gray-200 animate-pulse"
                : progressState.completedChars > 0
                ? "!bg-gray-700 !text-white !border-gray-600"
                : undefined
            )}
          >
            {isReturnKeyGreen() ? "✓ return" : "return"}
          </Key>
        </div>

        <div className="flex gap-2 justify-center">
          <Key
            onClick={() => handleKeyPress("SHIFT")}
            onPointerDown={() => setPressedKeys((prev) => new Set(prev).add("SHIFT"))}
            onPointerCancel={() =>
              setPressedKeys((prev) => {
                const next = new Set(prev)
                next.delete("SHIFT")
                return next
              })
            }
            onPointerUp={() =>
              setPressedKeys((prev) => {
                const next = new Set(prev)
                next.delete("SHIFT")
                return next
              })
            }
            onBlur={() =>
              setPressedKeys((prev) => {
                const next = new Set(prev)
                next.delete("SHIFT")
                return next
              })
            }
            isPressed={pressedKeys.has("SHIFT")}
            size="lg"
          >
            shift
          </Key>
          {KEYBOARD_LAYOUT.bottomRow.map((key) => (
            <Key
              key={key}
              onClick={() => handleKeyPress(key)}
              isPressed={pressedKeys.has(key) || isKeyHighlighted(key)}
              className={cn(
                "transition-all duration-300",
                isKeyHighlighted(key) && (
                  hintState.urgency === 'high'
                    ? "!border-white/80 !shadow-lg !shadow-white/60 !animate-pulse"
                    : hintState.urgency === 'medium'
                    ? "!border-gray-300 !shadow-lg !shadow-gray-300/60"
                    : "!border-white/60 !shadow-lg !shadow-white/50"
                )
              )}
            >
              {key}
            </Key>
          ))}
          <Key onClick={() => handleKeyPress("BACKSPACE")} isPressed={pressedKeys.has("BACKSPACE")} size="lg">
            delete
          </Key>
        </div>

        <div className="flex gap-2 justify-center items-center">
          <Key size="md">fn</Key>
          <Key size="md">^</Key>
          <Key size="md">⌥</Key>
          <Key size="md">⌘</Key>
          <Key onClick={() => handleKeyPress("SPACE")} isPressed={pressedKeys.has(" ")} aria-label="space" size="xl">
            {" "}
          </Key>
          <Key size="md">⌘</Key>
          <Key size="md">⌥</Key>
        </div>
      </div>

      {/* removed empty footer spacer */}
    </div>
  )
}
