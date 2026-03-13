import { NextResponse } from "next/server"
import { ARTICLES, USERS } from "@/lib/data"

interface StatsResponse {
  success: boolean
  stats?: {
    totalArticles: number
    totalUsers: number
    uniqueSources: number
    uniqueKeywords: number
    sentimentBreakdown: {
      positive: number
      neutral: number
      negative: number
    }
    apiUsage: {
      totalCalls: number
      successRate: number
      avgResponseTime: number
    }
  }
  error?: string
}

export async function GET() {
  try {
    const sources = new Set(ARTICLES.map((a) => a.source))
    const keywords = new Set(ARTICLES.map((a) => a.keyword))

    const sentimentCounts = ARTICLES.reduce(
      (acc, article) => {
        acc[article.sentiment]++
        return acc
      },
      { positive: 0, neutral: 0, negative: 0 }
    )

    const stats = {
      totalArticles: ARTICLES.length,
      totalUsers: USERS.length,
      uniqueSources: sources.size,
      uniqueKeywords: keywords.size,
      sentimentBreakdown: sentimentCounts,
      apiUsage: {
        totalCalls: 1247,
        successRate: 98.5,
        avgResponseTime: 245,
      },
    }

    return NextResponse.json<StatsResponse>({
      success: true,
      stats,
    })
  } catch {
    return NextResponse.json<StatsResponse>(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
