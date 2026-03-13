import { NextResponse } from "next/server"
import { ARTICLES, filterArticles } from "@/lib/data"
import type { ArticlesResponse } from "@/lib/types"

// GET all articles or filter by query params
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keywordsParam = searchParams.get("keywords")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    let articles = ARTICLES

    // Apply filters if provided
    if (keywordsParam && dateFrom && dateTo) {
      const keywords = keywordsParam.split(",").filter(Boolean)
      articles = filterArticles(keywords, dateFrom, dateTo)
    }

    return NextResponse.json<ArticlesResponse>({
      success: true,
      articles,
    })
  } catch {
    return NextResponse.json<ArticlesResponse>(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 }
    )
  }
}
