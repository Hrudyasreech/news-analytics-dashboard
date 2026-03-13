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

export type PageType = "summary" | "trends" | "topics" | "sentiment" | "reading-list" | "admin"

export interface Article {
  id: string
  title: string
  source: string
  keyword: string
  sentiment: "positive" | "neutral" | "negative"
  sentimentScore: number
  publishedDate: string
  description: string
  bookmarked: boolean
}

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
  const [articles, setArticles] = useState<Article[]>(generateMockArticles())

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

  function handleAnalyze() {
    setIsAnalyzing(true)
    setTimeout(() => {
      setArticles(generateMockArticles())
      setDataLoaded(true)
      setIsAnalyzing(false)
    }, 2000)
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

function generateMockArticles(): Article[] {
  const titles = [
    "AI Revolution: How Machine Learning is Transforming Industries",
    "Climate Summit 2024: World Leaders Agree on New Emission Targets",
    "Global Economy Shows Signs of Recovery Amid Uncertainty",
    "Healthcare Innovation: New Breakthrough in Cancer Treatment",
    "Election Updates: Key Battleground States to Watch",
    "Artificial Intelligence in Healthcare: Promise and Challenges",
    "Climate Change: Arctic Ice Melting Faster Than Expected",
    "Tech Giants Report Strong Quarterly Earnings",
    "Healthcare Costs Continue to Rise Across the Nation",
    "AI-Powered Tools Transform Modern Workplace",
    "Economic Outlook: Experts Predict Steady Growth",
    "Climate Action: Cities Lead the Way in Sustainability",
    "Election Security Measures Enhanced Nationwide",
    "Healthcare Access Improves in Rural Communities",
    "AI Ethics: Balancing Innovation with Responsibility",
  ]

  const sources = ["Reuters", "Bloomberg", "CNN", "BBC", "The Guardian", "AP News", "CNBC", "NPR"]
  const keywords = ["ai", "climate", "economy", "healthcare", "election"]

  return titles.map((title, index) => ({
    id: `article-${index}`,
    title,
    source: sources[Math.floor(Math.random() * sources.length)],
    keyword: keywords[Math.floor(Math.random() * keywords.length)],
    sentiment: (["positive", "neutral", "negative"] as const)[Math.floor(Math.random() * 3)],
    sentimentScore: Math.random() * 2 - 1,
    publishedDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    bookmarked: Math.random() > 0.8,
  }))
}
