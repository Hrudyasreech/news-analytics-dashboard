"use client"

import { Activity, Database, AlertTriangle, Download, Trash2, PieChart } from "lucide-react"
import type { Article } from "@/app/page"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/metric-card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, Cell, Pie, PieChart as RechartsPieChart } from "recharts"

interface AdminPageProps {
  articles: Article[]
}

export function AdminPage({ articles }: AdminPageProps) {
  // API usage stats (simulated)
  const apiStats = {
    totalCalls: 156,
    successRate: 98.7,
    avgResponseTime: 342,
    rateLimit: "1000/day",
  }

  // Dataset statistics
  const datasetStats = {
    totalArticles: articles.length,
    uniqueSources: new Set(articles.map((a) => a.source)).size,
    dateRange: "14 days",
    storageUsed: "2.4 MB",
  }

  // Keyword distribution
  const keywords = [...new Set(articles.map((a) => a.keyword))]
  const keywordDistribution = keywords.map((keyword) => ({
    keyword,
    count: articles.filter((a) => a.keyword === keyword).length,
    percentage: ((articles.filter((a) => a.keyword === keyword).length / articles.length) * 100).toFixed(1),
  }))

  const chartConfig = {
    count: { label: "Articles", color: "var(--color-chart-1)" },
  }

  // Duplicate detection (simulated)
  const duplicates = [
    { title: "AI Revolution: How Machine Learning...", count: 3 },
    { title: "Climate Summit 2024: World Leaders...", count: 2 },
  ]

  // Pie chart for keyword distribution
  const pieColors = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
  ]

  const pieData = keywordDistribution.map((item, idx) => ({
    ...item,
    fill: pieColors[idx % pieColors.length],
  }))

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">System monitoring and data management</p>
      </div>

      {/* Warning Banner */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex items-start gap-4 p-4">
          <div className="rounded-lg bg-warning/20 p-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="font-medium text-foreground">Admin Access Only</p>
            <p className="text-sm text-muted-foreground">
              These actions affect the entire system. Use with caution.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* API Usage Statistics */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">API Usage Statistics</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="Total API Calls"
            value={apiStats.totalCalls}
            icon={Activity}
            variant="default"
          />
          <MetricCard
            title="Success Rate"
            value={`${apiStats.successRate}%`}
            variant="success"
          />
          <MetricCard
            title="Avg Response Time"
            value={`${apiStats.avgResponseTime}ms`}
            variant="info"
          />
          <MetricCard
            title="Rate Limit"
            value={apiStats.rateLimit}
            variant="warning"
          />
        </div>
      </div>

      {/* Dataset Statistics */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Dataset Statistics</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="Total Articles"
            value={datasetStats.totalArticles}
            icon={Database}
          />
          <MetricCard
            title="Unique Sources"
            value={datasetStats.uniqueSources}
            variant="info"
          />
          <MetricCard
            title="Date Range"
            value={datasetStats.dateRange}
            variant="default"
          />
          <MetricCard
            title="Storage Used"
            value={datasetStats.storageUsed}
            variant="warning"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Keyword Distribution Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Keyword Distribution</CardTitle>
            <CardDescription>Article count by keyword</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={keywordDistribution}>
                <XAxis dataKey="keyword" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Keyword Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Keyword Share</CardTitle>
            <CardDescription>Percentage distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[300px]">
              <RechartsPieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={pieData}
                  dataKey="count"
                  nameKey="keyword"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={2}
                  label={({ keyword, percentage }) => `${keyword}: ${percentage}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Duplicate Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Duplicate Article Monitor</CardTitle>
          <CardDescription>Articles that appear multiple times in the dataset</CardDescription>
        </CardHeader>
        <CardContent>
          {duplicates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No duplicates detected.</p>
          ) : (
            <div className="space-y-3">
              {duplicates.map((dup, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <p className="text-sm text-foreground line-clamp-1">{dup.title}</p>
                  <span className="shrink-0 rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
                    {dup.count} copies
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Data Management</CardTitle>
          <CardDescription>Administrative actions for data management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear Dataset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
