import { Bookmark, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import type { Article } from "@/app/page"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ArticleCardProps {
  article: Article
  onToggleBookmark: (id: string) => void
}

const sentimentColors = {
  positive: "bg-success/20 text-success border-success/30",
  neutral: "bg-warning/20 text-warning border-warning/30",
  negative: "bg-destructive/20 text-destructive border-destructive/30",
}

const sentimentLabels = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
}

export function ArticleCard({ article, onToggleBookmark }: ArticleCardProps) {
  return (
    <Card className="group transition-all hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{article.source}</span>
              <span>•</span>
              <span>{format(new Date(article.publishedDate), "MMM d, yyyy")}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onToggleBookmark(article.id)}
          >
            <Bookmark
              className={cn(
                "h-4 w-4",
                article.bookmarked
                  ? "fill-primary text-primary"
                  : "text-muted-foreground"
              )}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {article.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-secondary/50">
              {article.keyword}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-xs", sentimentColors[article.sentiment])}
            >
              {sentimentLabels[article.sentiment]}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground hover:text-primary">
            Read more
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
