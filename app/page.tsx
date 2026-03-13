"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SummaryPage } from "@/components/pages/summary-page"
import { TrendsPage } from "@/components/pages/trends-page"
import { TopicsPage } from "@/components/pages/topics-page"
import { SentimentPage } from "@/components/pages/sentiment-page"
import { ReadingListPage } from "@/components/pages/reading-list-page"
import { AdminPage } from "@/components/pages/admin-page"
import { LoginPage } from "@/components/login-page"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import type { Article, PageType } from "@/lib/types"
import { ARTICLES } from "@/lib/data"

// Re-export types for components that import from page.tsx
export type { Article, PageType } from "@/lib/types"

// Export User type for sidebar component
export interface User {
  email: string
  name: string
  isAdmin: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState<PageType>("summary")
  const [keywords, setKeywords] = useState<string[]>(["ai", "climate", "economy", "healthcare", "election"])
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(true)
  const [articles, setArticles] = useState<Article[]>(() => ARTICLES.map(a => ({ ...a })))

  function handleLogin(email: string, _password: string, isAdmin: boolean) {
    setUser({
      email,
      name: email.split("@")[0],
      isAdmin,
    })
  }

  function handleLogout() {
    setUser(null)
    setCurrentPage("summary")
  }

  async function handleAnalyze() {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords,
          dateFrom: dateRange.from.toISOString(),
          dateTo: dateRange.to.toISOString(),
        }),
      })
      const data = await response.json()
      if (data.success && data.articles) {
        setArticles(data.articles)
      }
      setDataLoaded(true)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  function toggleBookmark(articleId: string) {
    setArticles(prev =>
      prev.map(article =>
        article.id === articleId
          ? { ...article, bookmarked: !article.bookmarked }
          : article
      )
    )
  }

  const bookmarkedArticles = articles.filter(a => a.bookmarked)

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <SidebarProvider>
      <AppSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      <SidebarInset>
        <DashboardHeader
          keywords={keywords}
          setKeywords={setKeywords}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />
        <main className="flex-1 overflow-auto p-6">
          {currentPage === "summary" && (
            <SummaryPage
              articles={articles}
              keywords={keywords}
              dataLoaded={dataLoaded}
              onToggleBookmark={toggleBookmark}
            />
          )}
          {currentPage === "trends" && (
            <TrendsPage articles={articles} keywords={keywords} />
          )}
          {currentPage === "topics" && <TopicsPage />}
          {currentPage === "sentiment" && (
            <SentimentPage articles={articles} />
          )}
          {currentPage === "reading-list" && (
            <ReadingListPage
              articles={bookmarkedArticles}
              onToggleBookmark={toggleBookmark}
            />
          )}
          {currentPage === "admin" && <AdminPage articles={articles} />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}


