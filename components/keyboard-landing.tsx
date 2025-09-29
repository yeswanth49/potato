"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"

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

type KeyProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
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
      type="button"
      {...props}
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
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [iterationCount, setIterationCount] = useState(0)
  const errorResetTimeout = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (errorResetTimeout.current) {
        window.clearTimeout(errorResetTimeout.current)
        errorResetTimeout.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (iterationCount >= MAX_HINT_ITERATIONS) return

    let timeoutId: number | undefined

    const scheduleNext = () => {
      const currentHint = HINT_SEQUENCE[highlightIndex]
      let delay = 600

      if (currentHint === "return") {
        delay = 1200
      } else if (highlightIndex === HINT_SEQUENCE.length - 2) {
        delay = 500
      }

      timeoutId = window.setTimeout(() => {
        const nextIndex = (highlightIndex + 1) % HINT_SEQUENCE.length
        setHighlightIndex(nextIndex)

        if (nextIndex === 0) {
          setIterationCount((prev) => prev + 1)
        }
      }, delay)
    }

    scheduleNext()

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [highlightIndex, iterationCount])

  const isKeyHighlighted = (key: string) => {
    if (iterationCount >= MAX_HINT_ITERATIONS) return false
    const currentHint = HINT_SEQUENCE[highlightIndex]
    if (currentHint === "return") return false
    return key.toLowerCase() === currentHint
  }

  const isReturnKeyGreen = () => {
    if (iterationCount >= MAX_HINT_ITERATIONS) return false
    return HINT_SEQUENCE[highlightIndex] === "return"
  }

  const handleKeyPress = useCallback(
    (key: string) => {
      if (key === "BACKSPACE") {
        setText((prev) => prev.slice(0, -1))
        setShowError(false)
        return
      }

      if (key === "SPACE") {
        setText((prev) => prev + " ")
        return
      }

      if (key === "CAPS") {
        setCapsLock((prev) => !prev)
        return
      }

      // SHIFT is handled as a momentary key in pressedKeys state
      // No toggle action needed here

      if (key === "ENTER") {
        if (text.toLowerCase() === TARGET_TEXT) {
          onCorrectEntry()
      } else {
          setShowError(true)
          setText("")
          // clear any existing timeout before creating a new one
          if (errorResetTimeout.current) {
            window.clearTimeout(errorResetTimeout.current)
          }
          errorResetTimeout.current = window.setTimeout(() => {
            setShowError(false)
            errorResetTimeout.current = null
          }, 2000)
        }
        return
      }

      if (key === "SHIFT") {
        return
      }

      const shouldUppercase = capsLock !== pressedKeys.has("SHIFT")
      const finalKey = shouldUppercase ? key.toUpperCase() : key.toLowerCase()
      setText((prev) => prev + finalKey)
      setShowError(false)
    },
    [capsLock, onCorrectEntry, text, pressedKeys],
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
          handleKeyPress("CAPS")
          return
        }

        if (upperKey === "SHIFT") {
          handleKeyPress("SHIFT")
          return
        }

        if (upperKey === "ENTER") {
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
              className={isKeyHighlighted(key) ? "!bg-white !text-black !border-white/60 !shadow-lg !shadow-white/50" : undefined}
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
            >
              {key}
            </Key>
          ))}
          <Key
            onClick={() => handleKeyPress("ENTER")}
            isPressed={pressedKeys.has("ENTER")}
            size="lg"
            className={isReturnKeyGreen() ? "!bg-green-600 hover:!bg-green-500 !text-white !border-green-500" : undefined}
          >
            return
          </Key>
        </div>

        <div className="flex gap-2 justify-center">
          <Key
            onClick={() => handleKeyPress("SHIFT")}
            onMouseDown={() => setPressedKeys((prev) => new Set(prev).add("SHIFT"))}
            onMouseLeave={() =>
              setPressedKeys((prev) => {
                const next = new Set(prev)
                next.delete("SHIFT")
                return next
              })
            }
            onMouseUp={() => setPressedKeys((prev) => {
              const next = new Set(prev)
              next.delete("SHIFT")
              return next
            })}
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
          <Key onClick={() => handleKeyPress("SPACE")} isPressed={pressedKeys.has(" ")} size="xl">
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
