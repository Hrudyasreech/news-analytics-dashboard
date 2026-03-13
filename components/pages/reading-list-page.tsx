"use client"

import { BookMarked } from "lucide-react"
import type { Article } from "@/app/page"
import { ArticleCard } from "@/components/article-card"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

interface ReadingListPageProps {
  articles: Article[]
  onToggleBookmark: (id: string) => void
}

export function ReadingListPage({ articles, onToggleBookmark }: ReadingListPageProps) {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reading List</h1>
        <p className="text-muted-foreground">Your saved articles for later reading</p>
      </div>

      {articles.length === 0 ? (
        <Empty className="min-h-[300px] border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookMarked className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No saved articles</EmptyTitle>
            <EmptyDescription>
              Bookmark articles from the Summary page to add them to your reading list.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {/* Count */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookMarked className="h-4 w-4" />
            <span>{articles.length} saved article{articles.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Articles Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
