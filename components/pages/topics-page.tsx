"use client"

import { MessageSquare, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MetricCard } from "@/components/metric-card"

const ldaTopics = [
  {
    id: 1,
    label: "Technology & AI Innovation",
    words: ["artificial", "intelligence", "machine", "learning", "technology", "innovation", "automation", "digital"],
    color: "bg-chart-1/10 border-chart-1/30",
  },
  {
    id: 2,
    label: "Climate & Environment",
    words: ["climate", "change", "environment", "carbon", "emissions", "sustainable", "green", "renewable"],
    color: "bg-chart-2/10 border-chart-2/30",
  },
  {
    id: 3,
    label: "Economy & Markets",
    words: ["economy", "market", "growth", "inflation", "stocks", "investment", "trade", "financial"],
    color: "bg-chart-3/10 border-chart-3/30",
  },
  {
    id: 4,
    label: "Healthcare & Medicine",
    words: ["healthcare", "medical", "treatment", "patients", "hospital", "research", "drug", "vaccine"],
    color: "bg-chart-4/10 border-chart-4/30",
  },
  {
    id: 5,
    label: "Politics & Policy",
    words: ["election", "vote", "campaign", "policy", "government", "legislation", "senate", "congress"],
    color: "bg-chart-5/10 border-chart-5/30",
  },
]

export function TopicsPage() {
  const totalTopics = ldaTopics.length
  const totalWords = ldaTopics.reduce((sum, topic) => sum + topic.words.length, 0)
  const avgWordsPerTopic = (totalWords / totalTopics).toFixed(1)

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Topics</h1>
        <p className="text-muted-foreground">
          LDA (Latent Dirichlet Allocation) discovers abstract topics from documents
        </p>
      </div>

      {/* Info Alert */}
      <Card className="border-info/30 bg-info/5">
        <CardContent className="flex items-start gap-4 p-4">
          <div className="rounded-lg bg-info/20 p-2">
            <Sparkles className="h-5 w-5 text-info" />
          </div>
          <div>
            <p className="font-medium text-foreground">About LDA Topic Modeling</p>
            <p className="text-sm text-muted-foreground">
              Each topic shows its top 8 relevant words discovered through statistical analysis.
              Topics are auto-generated labels based on the most representative terms.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Topic Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Number of Topics"
          value={totalTopics}
          icon={MessageSquare}
          variant="default"
        />
        <MetricCard
          title="Total Words"
          value={totalWords}
          variant="info"
        />
        <MetricCard
          title="Avg Words/Topic"
          value={avgWordsPerTopic}
          variant="warning"
        />
      </div>

      {/* Topic Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Discovered Topics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ldaTopics.map((topic) => (
            <Card key={topic.id} className={topic.color}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-sm font-bold text-primary">{topic.id}</span>
                  </div>
                  <CardTitle className="text-base font-semibold">{topic.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {topic.words.map((word) => (
                    <Badge
                      key={word}
                      variant="secondary"
                      className="text-xs bg-background/50 hover:bg-background/80"
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Export Topics</CardTitle>
          <CardDescription>Download the topic analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Download Topics CSV
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
