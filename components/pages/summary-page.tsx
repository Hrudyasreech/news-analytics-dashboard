"use client"

import { Newspaper, Building2, Hash, ThumbsUp } from "lucide-react"
import type { Article } from "@/app/page"
import { MetricCard } from "@/components/metric-card"
import { ArticleCard } from "@/components/article-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface SummaryPageProps {
  articles: Article[]
  keywords: string[]
  dataLoaded: boolean
  onToggleBookmark: (id: string) => void
}

export function SummaryPage({ articles, keywords, dataLoaded, onToggleBookmark }: SummaryPageProps) {
  if (!dataLoaded) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Use the sidebar to fetch and analyze news articles.</p>
      </div>
    )
  }

  const uniqueSources = new Set(articles.map((a) => a.source)).size
  const positivePercent = Math.round(
    (articles.filter((a) => a.sentiment === "positive").length / articles.length) * 100
  )

  // Articles by keyword
  const keywordData = keywords.map((keyword) => ({
    keyword,
    count: articles.filter((a) => a.keyword === keyword).length,
  }))

  // Top sources
  const sourceCounts: Record<string, number> = {}
  articles.forEach((a) => {
    sourceCounts[a.source] = (sourceCounts[a.source] || 0) + 1
  })
  const sourceData = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([source, count]) => ({ source, count }))

  const chartConfig = {
    count: {
      label: "Articles",
      color: "var(--color-chart-1)",
    },
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Summary</h1>
        <p className="text-muted-foreground">Overview of your news analysis pipeline</p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Articles"
          value={articles.length}
          icon={Newspaper}
          trend={{ value: 12, label: "vs last period" }}
        />
        <MetricCard
          title="Unique Sources"
          value={uniqueSources}
          icon={Building2}
          variant="info"
        />
        <MetricCard
          title="Keywords Analyzed"
          value={keywords.length}
          icon={Hash}
          variant="warning"
        />
        <MetricCard
          title="Positive Sentiment"
          value={`${positivePercent}%`}
          icon={ThumbsUp}
          variant="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Articles by Keyword */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Articles by Keyword</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={keywordData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="keyword" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top News Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top News Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={sourceData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="source" type="category" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-chart-2)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Article Preview Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Articles</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
