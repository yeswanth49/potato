"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { KeyboardBackground } from "./keyboard-background"

const KEYBOARD_LAYOUT = {
  numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  topRow: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  middleRow: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  bottomRow: ["Z", "X", "C", "V", "B", "N", "M"],
}

interface KeyProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  isPressed?: boolean
  size?: "sm" | "md" | "lg" | "xl"
}

function Key({ children, onClick, className, isPressed, size = "md" }: KeyProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-sm",
    md: "w-14 h-14 text-base",
    lg: "w-20 h-14 text-base",
    xl: "w-96 h-14 text-base",
  }

  return (
    <button
      onClick={onClick}
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
}

export function KeyboardLanding({ onCorrectEntry }: KeyboardLandingProps) {
  // 🎨 BACKGROUND TOGGLE: Change this to switch between dark background and keyboard background
  // Set to 'dark' for solid black background, 'keyboard' for animated keyboard background
  const BACKGROUND_MODE = 'dark' as 'dark' | 'keyboard' // <- Change this value to toggle
  
  const [text, setText] = useState("")
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [capsLock, setCapsLock] = useState(false)
  const [showError, setShowError] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [iterationCount, setIterationCount] = useState(0)
  const targetText = "yesh"
  const hintSequence = ["y", "e", "s", "h", "return"]
  const maxIterations = 2

  // Highlighting loop for YESH + RETURN sequence with better rhythm (2 iterations only)
  useEffect(() => {
    if (iterationCount >= maxIterations) return
    
    let timeoutId: NodeJS.Timeout
    
    const scheduleNext = () => {
      const currentHint = hintSequence[highlightIndex]
      let delay: number
      
      if (currentHint === "return") {
        // Longer pause after RETURN before starting over
        delay = 1200
      } else if (highlightIndex === hintSequence.length - 2) {
        // Shorter pause before RETURN (after 'h')
        delay = 500
      } else {
        // Normal rhythm for Y-E-S-H
        delay = 600
      }
      
      timeoutId = setTimeout(() => {
        const nextIndex = (highlightIndex + 1) % hintSequence.length
        setHighlightIndex(nextIndex)
        
        // If we completed a full cycle (back to start), increment iteration count
        if (nextIndex === 0) {
          setIterationCount(prev => prev + 1)
        }
      }, delay)
    }
    
    scheduleNext()
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [highlightIndex, iterationCount, hintSequence, maxIterations])

  // Helper function to check if a key should be highlighted (pressed state only)
  const isKeyHighlighted = (key: string) => {
    if (iterationCount >= maxIterations) return false // Stop highlighting after 2 iterations
    
    const currentHint = hintSequence[highlightIndex]
    if (currentHint === "return") {
      return false // Don't use regular highlight for return key
    }
    return key.toLowerCase() === currentHint
  }

  // Helper function to check if return key should be green
  const isReturnKeyGreen = () => {
    if (iterationCount >= maxIterations) return false // Stop highlighting after 2 iterations
    return hintSequence[highlightIndex] === "return"
  }

  const handleKeyPress = useCallback(
    (key: string) => {
      if (key === "BACKSPACE") {
        setText((prev) => prev.slice(0, -1))
        setShowError(false)
      } else if (key === "SPACE") {
        setText((prev) => prev + " ")
      } else if (key === "CAPS") {
        setCapsLock((prev) => !prev)
      } else if (key === "SHIFT") {
        // Handle SHIFT as a modifier, don't append text
        setCapsLock((prev) => !prev)
        return
      } else if (key === "ENTER") {
        if (text.toLowerCase() === targetText.toLowerCase()) {
          onCorrectEntry()
        } else {
          setShowError(true)
          setText("")
          setTimeout(() => setShowError(false), 2000)
        }
      } else {
        const finalKey = capsLock ? key.toUpperCase() : key.toLowerCase()
        setText((prev) => prev + finalKey)
        setShowError(false)
      }
    },
    [capsLock, text, onCorrectEntry, targetText],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()

      // Check if this is a key the virtual keyboard handles
      const isHandledKey = 
        key === "BACKSPACE" ||
        key === " " ||
        key === "CAPSLOCK" ||
        key === "ENTER" ||
        /^[A-Z0-9]$/.test(key)

      // Only prevent default for keys we handle
      if (isHandledKey) {
        e.preventDefault()
        setPressedKeys((prev) => new Set(prev).add(key))

        if (key === "BACKSPACE") {
          handleKeyPress("BACKSPACE")
        } else if (key === " ") {
          handleKeyPress("SPACE")
        } else if (key === "CAPSLOCK") {
          handleKeyPress("CAPS")
        } else if (key === "ENTER") {
          handleKeyPress("ENTER")
        } else if (/^[A-Z0-9]$/.test(key)) {
          handleKeyPress(key)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      setPressedKeys((prev) => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleKeyPress])

  // Determine background class based on mode
  const backgroundClass = BACKGROUND_MODE === 'dark' 
    ? 'bg-black' // Solid black background
    : 'bg-gray-900' // Slightly lighter background to show keyboard behind

  // Debug: Log the current mode (remove this after testing)
  console.log('BACKGROUND_MODE:', BACKGROUND_MODE, 'Should show keyboard:', BACKGROUND_MODE === 'keyboard')

  return (
    <div className={`min-h-screen p-8 flex flex-col items-center justify-center gap-8 relative ${backgroundClass}`}>
      {/* Conditional Background - Keyboard background only shows when BACKGROUND_MODE is 'keyboard' */}
      {BACKGROUND_MODE === 'keyboard' && <KeyboardBackground />}
      
      {/* Text Display */}
      <div className="w-full max-w-4xl"></div>

      {/* Error Message */}
      {showError && (
        <div className="absolute top-1/3 z-20">
          <p className="text-red-400 text-xl animate-pulse font-light">
            Try again...
          </p>
        </div>
      )}

      {/* Keyboard */}
      <div className="relative flex flex-col gap-2 p-8 bg-black rounded-2xl scale-150">
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-black to-transparent z-10 rounded-l-2xl pointer-events-none"></div>

        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-black to-transparent z-10 rounded-r-2xl pointer-events-none"></div>

        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-10 rounded-t-2xl pointer-events-none"></div>

        {/* Number Row */}
        <div className="flex gap-2 justify-center">
          {KEYBOARD_LAYOUT.numbers.map((key) => (
            <Key 
              key={key} 
              onClick={() => handleKeyPress(key)} 
              isPressed={pressedKeys.has(key) || isKeyHighlighted(key)}
              className={isKeyHighlighted(key) ? "!bg-white-500 !text-white !border-white-400 !shadow-lg !shadow-white-500/50" : ""}
            >
              {key}
            </Key>
          ))}
        </div>

        {/* Top Row (QWERTY) */}
        <div className="flex gap-2 justify-center">
          {KEYBOARD_LAYOUT.topRow.map((key) => (
            <Key 
              key={key} 
              onClick={() => handleKeyPress(key)} 
              isPressed={pressedKeys.has(key) || isKeyHighlighted(key)}
              className=""
            >
              {key}
            </Key>
          ))}
        </div>

        {/* Middle Row (ASDF) */}
        <div className="flex gap-2 justify-center">
          <Key
            onClick={() => handleKeyPress("CAPS")}
            isPressed={capsLock}
            size="lg"
            className={capsLock ? "bg-blue-600 hover:bg-blue-500" : ""}
          >
            caps
          </Key>
          {KEYBOARD_LAYOUT.middleRow.map((key) => (
            <Key 
              key={key} 
              onClick={() => handleKeyPress(key)} 
              isPressed={pressedKeys.has(key) || isKeyHighlighted(key)}
              className=""
            >
              {key}
            </Key>
          ))}
          <Key 
            onClick={() => handleKeyPress("ENTER")} 
            isPressed={pressedKeys.has("ENTER")} 
            size="lg"
            className={isReturnKeyGreen() ? "!bg-green-600 hover:!bg-green-500 !text-white !border-green-500" : ""}
          >
            return
          </Key>
        </div>

        {/* Bottom Row (ZXCV) */}
        <div className="flex gap-2 justify-center">
          <Key 
            onClick={() => handleKeyPress("SHIFT")} 
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
              className=""
            >
              {key}
            </Key>
          ))}
          <Key 
            onClick={() => handleKeyPress("BACKSPACE")} 
            isPressed={pressedKeys.has("BACKSPACE")} 
            size="lg"
          >
            delete
          </Key>
        </div>

        {/* Space Row */}
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

      {/* Instructions */}
      <div className="text-gray-500 text-center max-w-md"></div>
    </div>
  )
}
