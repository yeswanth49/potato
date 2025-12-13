"use client"

import { useState, useEffect } from "react"

import { Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeSpentBadgeProps {
    className?: string
}

interface CodingTimeData {
    today: string
    yesterday: string
    todaySeconds: number
    yesterdaySeconds: number
    error?: string
}

export function TimeSpentBadge({ className }: TimeSpentBadgeProps) {
    const [showYesterday, setShowYesterday] = useState(false)
    const [codingTime, setCodingTime] = useState<CodingTimeData>({
        today: "0m",
        yesterday: "0m",
        todaySeconds: 0,
        yesterdaySeconds: 0,
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCodingTime() {
            try {
                setIsLoading(true)
                const response = await fetch("/api/coding-time")
                const data: CodingTimeData = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch coding time")
                }

                setCodingTime(data)
                setError(null)
            } catch (err) {
                console.error("Error fetching coding time:", err)
                setError(err instanceof Error ? err.message : "Failed to load")
                // Keep default/previous values on error
            } finally {
                setIsLoading(false)
            }
        }

        fetchCodingTime()

        // Refresh every 5 minutes
        const interval = setInterval(fetchCodingTime, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const displayText = isLoading
        ? "loading..."
        : showYesterday
            ? `${codingTime.yesterday} yesterday`
            : `${codingTime.today} coded today`

    return (
        <div
            className={cn(
                "cursor-pointer hover:text-primary transition-colors select-none flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground w-fit",
                className
            )}
            onClick={() => !isLoading && setShowYesterday(!showYesterday)}
            title={
                error
                    ? `Error: ${error}`
                    : "Click to toggle between today and yesterday"
            }
        >
            {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
                <Clock className="w-3.5 h-3.5" />
            )}
            <span className={cn(error && "text-red-500/50")}>{displayText}</span>
        </div>
    )
}
