"use client"

import { format, subDays } from "date-fns"
import type { Article } from "@/app/page"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, Bar, BarChart } from "recharts"

interface TrendsPageProps {
  articles: Article[]
  keywords: string[]
}

export function TrendsPage({ articles, keywords }: TrendsPageProps) {
  // Generate time series data for last 14 days
  const timeSeriesData = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i)
    const dateStr = format(date, "yyyy-MM-dd")
    const dayArticles = articles.filter(
      (a) => format(new Date(a.publishedDate), "yyyy-MM-dd") === dateStr
    )
    
    const keywordCounts: Record<string, number> = {}
    keywords.forEach((kw) => {
      keywordCounts[kw] = dayArticles.filter((a) => a.keyword === kw).length
    })

    const avgSentiment =
      dayArticles.length > 0
        ? dayArticles.reduce((sum, a) => sum + a.sentimentScore, 0) / dayArticles.length
        : 0

    return {
      date: format(date, "MMM d"),
      ...keywordCounts,
      sentiment: Number(avgSentiment.toFixed(2)),
      total: dayArticles.length,
    }
  })

  // TF-IDF top keywords (simulated)
  const tfidfData = [
    { keyword: "artificial intelligence", score: 0.089 },
    { keyword: "machine learning", score: 0.076 },
    { keyword: "climate change", score: 0.068 },
    { keyword: "economic growth", score: 0.061 },
    { keyword: "healthcare reform", score: 0.054 },
    { keyword: "election results", score: 0.048 },
    { keyword: "global warming", score: 0.042 },
    { keyword: "tech industry", score: 0.038 },
    { keyword: "policy changes", score: 0.033 },
    { keyword: "market trends", score: 0.028 },
  ]

  const keywordChartConfig = keywords.reduce(
    (acc, kw, idx) => ({
      ...acc,
      [kw]: {
        label: kw.charAt(0).toUpperCase() + kw.slice(1),
        color: `var(--color-chart-${(idx % 5) + 1})`,
      },
    }),
    {} as Record<string, { label: string; color: string }>
  )

  const sentimentChartConfig = {
    sentiment: {
      label: "Avg Sentiment",
      color: "var(--color-chart-1)",
    },
  }

  const tfidfChartConfig = {
    score: {
      label: "TF-IDF Score",
      color: "var(--color-chart-3)",
    },
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Trends</h1>
        <p className="text-muted-foreground">Analyze keyword frequency and sentiment over time</p>
      </div>

      {/* Keyword Frequency Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Keyword Frequency Over Time</CardTitle>
          <CardDescription>Daily article count by keyword over the past 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={keywordChartConfig} className="h-[350px]">
            <LineChart data={timeSeriesData}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {keywords.map((kw, idx) => (
                <Line
                  key={kw}
                  type="monotone"
                  dataKey={kw}
                  stroke={`var(--color-chart-${(idx % 5) + 1})`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Sentiment Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Average Sentiment Over Time</CardTitle>
          <CardDescription>Daily average sentiment score (-1 to 1)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={sentimentChartConfig} className="h-[300px]">
            <LineChart data={timeSeriesData}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis domain={[-1, 1]} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="sentiment"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-1)" }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top TF-IDF Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top TF-IDF Keywords</CardTitle>
          <CardDescription>Most important keywords based on term frequency-inverse document frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={tfidfChartConfig} className="h-[400px]">
            <BarChart data={tfidfData} layout="vertical">
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis dataKey="keyword" type="category" width={150} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" fill="var(--color-chart-3)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
