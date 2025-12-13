import { NextResponse } from "next/server"

interface WakaTimeResponse {
    data: Array<{
        grand_total?: {
            total_seconds: number
        }
    }>
    cumulative_total: {
        seconds: number
        text: string
    }
}

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours === 0 && minutes === 0) {
        return "0m"
    }
    if (hours === 0) {
        return `${minutes}m`
    }
    if (minutes === 0) {
        return `${hours}h`
    }
    return `${hours}h ${minutes}m`
}

function getDateString(daysAgo: number): string {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    return date.toISOString().split("T")[0]
}

async function fetchWakaTimeStats(date: string): Promise<number> {
    const apiKey = process.env.WAKATIME_API_KEY

    if (!apiKey) {
        throw new Error("WAKATIME_API_KEY not configured")
    }

    const url = `https://wakatime.com/api/v1/users/current/summaries?start=${date}&end=${date}`

    console.log('Fetching WakaTime stats for date:', date)
    console.log('API URL:', url)

    const response = await fetch(url, {
        headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error('WakaTime API error response:', errorText)
        throw new Error(`WakaTime API error: ${response.status} - ${errorText}`)
    }

    const data: WakaTimeResponse = await response.json()
    console.log('WakaTime response data:', JSON.stringify(data, null, 2))
    return data.cumulative_total?.seconds || 0
}

export async function GET() {
    try {
        const today = getDateString(0)
        const yesterday = getDateString(1)

        const [todaySeconds, yesterdaySeconds] = await Promise.all([
            fetchWakaTimeStats(today),
            fetchWakaTimeStats(yesterday),
        ])

        return NextResponse.json({
            today: formatDuration(todaySeconds),
            yesterday: formatDuration(yesterdaySeconds),
            todaySeconds,
            yesterdaySeconds,
        })
    } catch (error) {
        console.error("Error fetching WakaTime stats:", error)

        // Return fallback data on error
        return NextResponse.json(
            {
                today: "0m",
                yesterday: "0m",
                todaySeconds: 0,
                yesterdaySeconds: 0,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        )
    }
}
