"use client"

import { ThumbsUp, Minus, ThumbsDown, Info } from "lucide-react"
import type { Article } from "@/app/page"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MetricCard } from "@/components/metric-card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Pie, PieChart, Bar, BarChart, XAxis, YAxis, Cell } from "recharts"

interface SentimentPageProps {
  articles: Article[]
}

export function SentimentPage({ articles }: SentimentPageProps) {
  const positive = articles.filter((a) => a.sentiment === "positive").length
  const neutral = articles.filter((a) => a.sentiment === "neutral").length
  const negative = articles.filter((a) => a.sentiment === "negative").length
  const total = articles.length

  const pieData = [
    { name: "Positive", value: positive, fill: "var(--color-success)" },
    { name: "Neutral", value: neutral, fill: "var(--color-warning)" },
    { name: "Negative", value: negative, fill: "var(--color-destructive)" },
  ]

  const pieChartConfig = {
    Positive: { label: "Positive", color: "var(--color-success)" },
    Neutral: { label: "Neutral", color: "var(--color-warning)" },
    Negative: { label: "Negative", color: "var(--color-destructive)" },
  }

  // Sentiment by keyword
  const keywords = [...new Set(articles.map((a) => a.keyword))]
  const sentimentByKeyword = keywords.map((keyword) => {
    const kwArticles = articles.filter((a) => a.keyword === keyword)
    return {
      keyword,
      positive: kwArticles.filter((a) => a.sentiment === "positive").length,
      neutral: kwArticles.filter((a) => a.sentiment === "neutral").length,
      negative: kwArticles.filter((a) => a.sentiment === "negative").length,
    }
  })

  const barChartConfig = {
    positive: { label: "Positive", color: "var(--color-success)" },
    neutral: { label: "Neutral", color: "var(--color-warning)" },
    negative: { label: "Negative", color: "var(--color-destructive)" },
  }

  // Score statistics
  const scores = articles.map((a) => a.sentimentScore)
  const mean = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(4)
  const sortedScores = [...scores].sort((a, b) => a - b)
  const median = sortedScores[Math.floor(sortedScores.length / 2)].toFixed(4)
  const stdDev = Math.sqrt(
    scores.reduce((sum, s) => sum + Math.pow(s - parseFloat(mean), 2), 0) / scores.length
  ).toFixed(4)

  // Most positive/negative articles
  const sortedByScore = [...articles].sort((a, b) => b.sentimentScore - a.sentimentScore)
  const mostPositive = sortedByScore.slice(0, 5)
  const mostNegative = sortedByScore.slice(-5).reverse()

  // Histogram data
  const histogramBins = Array.from({ length: 10 }, (_, i) => {
    const min = -1 + i * 0.2
    const max = min + 0.2
    return {
      range: `${min.toFixed(1)} to ${max.toFixed(1)}`,
      count: articles.filter((a) => a.sentimentScore >= min && a.sentimentScore < max).length,
    }
  })

  const histogramConfig = {
    count: { label: "Articles", color: "var(--color-chart-5)" },
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sentiment Analysis</h1>
        <p className="text-muted-foreground">VADER sentiment classification of news articles</p>
      </div>

      {/* Info Alert */}
      <Card className="border-info/30 bg-info/5">
        <CardContent className="flex items-start gap-4 p-4">
          <div className="rounded-lg bg-info/20 p-2">
            <Info className="h-5 w-5 text-info" />
          </div>
          <div>
            <p className="font-medium text-foreground">Sentiment Classification</p>
            <p className="text-sm text-muted-foreground">
              Positive (≥0.2), Neutral (-0.2 to 0.2), Negative (≤-0.2) based on VADER compound scores.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Positive"
          value={positive}
          subtitle={`${((positive / total) * 100).toFixed(1)}%`}
          icon={ThumbsUp}
          variant="success"
        />
        <MetricCard
          title="Neutral"
          value={neutral}
          subtitle={`${((neutral / total) * 100).toFixed(1)}%`}
          icon={Minus}
          variant="warning"
        />
        <MetricCard
          title="Negative"
          value={negative}
          subtitle={`${((negative / total) * 100).toFixed(1)}%`}
          icon={ThumbsDown}
          variant="info"
        />
        <MetricCard title="Total Articles" value={total} variant="default" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig} className="mx-auto aspect-square h-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sentiment by Keyword */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sentiment by Keyword</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[300px]">
              <BarChart data={sentimentByKeyword}>
                <XAxis dataKey="keyword" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="positive" stackId="a" fill="var(--color-success)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="neutral" stackId="a" fill="var(--color-warning)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="negative" stackId="a" fill="var(--color-destructive)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Histogram */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Sentiment Score Distribution</CardTitle>
          <CardDescription>Distribution of sentiment scores from -1 to 1</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={histogramConfig} className="h-[250px]">
            <BarChart data={histogramBins}>
              <XAxis dataKey="range" tickLine={false} axisLine={false} fontSize={10} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-chart-5)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Score Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Mean</p>
              <p className="text-2xl font-bold text-foreground">{mean}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Median</p>
              <p className="text-2xl font-bold text-foreground">{median}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Std Dev</p>
              <p className="text-2xl font-bold text-foreground">{stdDev}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Range</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.min(...scores).toFixed(2)} to {Math.max(...scores).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Most Positive & Negative */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-success">Top 5 Most Positive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostPositive.map((article, i) => (
                <div key={article.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20 text-xs font-bold text-success">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{article.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {article.source} • Score: {article.sentimentScore.toFixed(3)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-destructive">Top 5 Most Negative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostNegative.map((article, i) => (
                <div key={article.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/20 text-xs font-bold text-destructive">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{article.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {article.source} • Score: {article.sentimentScore.toFixed(3)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
