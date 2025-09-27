"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

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

  // For decorative keys without onClick, use div instead of button
  const Element = onClick ? "button" : "div"
  const elementProps = onClick ? { onClick } : { role: "presentation", "aria-hidden": true }

  return (
    <Element
      {...elementProps}
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
    </Element>
  )
}

export function KeyboardBackground() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [capsLock, setCapsLock] = useState(false)

  const handleKeyPress = useCallback(
    (key: string) => {
      if (key === "CAPS") {
        setCapsLock((prev) => !prev)
      }
      // We don't need text functionality for background, just visual feedback
    },
    [],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()

      // Check if event target is an interactive element
      const target = e.target as HTMLElement
      const isInteractiveElement = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        (target instanceof HTMLElement && (target.isContentEditable || (target.closest && target.closest('[contenteditable]'))))

      // Only prevent default for specific keys and when not on interactive elements
      if (!isInteractiveElement && (key === "CAPSLOCK" || key === "CAPS")) {
        e.preventDefault()
      }

      setPressedKeys((prev) => new Set(prev).add(key))

      if (key === "CAPSLOCK") {
        handleKeyPress("CAPS")
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

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
      {/* Keyboard positioned as background */}
      <div className="relative flex flex-col gap-2 p-8 bg-transparent rounded-2xl scale-150 opacity-30 hover:opacity-30 transition-opacity duration-500">
        {/* Gradient overlays for depth */}
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-black to-transparent z-10 rounded-l-2xl pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-black to-transparent z-10 rounded-r-2xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black to-transparent z-10 rounded-t-2xl pointer-events-none"></div>

        {/* Number Row */}
        <div className="flex gap-2 justify-center">
          {KEYBOARD_LAYOUT.numbers.map((key) => (
            <Key key={key} onClick={() => handleKeyPress(key)} isPressed={pressedKeys.has(key)}>
              {key}
            </Key>
          ))}
        </div>

        {/* Top Row (QWERTY) */}
        <div className="flex gap-2 justify-center">
          {KEYBOARD_LAYOUT.topRow.map((key) => (
            <Key key={key} onClick={() => handleKeyPress(key)} isPressed={pressedKeys.has(key)}>
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
            <Key key={key} onClick={() => handleKeyPress(key)} isPressed={pressedKeys.has(key)}>
              {key}
            </Key>
          ))}
          <Key onClick={() => handleKeyPress("ENTER")} isPressed={pressedKeys.has("ENTER")} size="lg">
            return
          </Key>
        </div>

        {/* Bottom Row (ZXCV) */}
        <div className="flex gap-2 justify-center">
          <Key onClick={() => handleKeyPress("SHIFT")} isPressed={pressedKeys.has("SHIFT")} size="lg">
            shift
          </Key>
          {KEYBOARD_LAYOUT.bottomRow.map((key) => (
            <Key key={key} onClick={() => handleKeyPress(key)} isPressed={pressedKeys.has(key)}>
              {key}
            </Key>
          ))}
          <Key onClick={() => handleKeyPress("BACKSPACE")} isPressed={pressedKeys.has("BACKSPACE")} size="lg">
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
    </div>
  )
}
