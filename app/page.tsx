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
  const [articles, setArticles] = useState<Article[]>(() => generateMockArticles())

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

// Deterministic mock data to avoid hydration mismatches
const MOCK_ARTICLES: Article[] = [
  { id: "article-0", title: "AI Revolution: How Machine Learning is Transforming Industries", source: "Reuters", keyword: "ai", sentiment: "positive", sentimentScore: 0.72, publishedDate: "2026-03-10T10:00:00Z", description: "Artificial intelligence continues to reshape business operations across sectors, from manufacturing to finance.", bookmarked: false },
  { id: "article-1", title: "Climate Summit 2024: World Leaders Agree on New Emission Targets", source: "BBC", keyword: "climate", sentiment: "positive", sentimentScore: 0.65, publishedDate: "2026-03-09T14:30:00Z", description: "Global leaders have committed to ambitious new targets for reducing carbon emissions by 2035.", bookmarked: false },
  { id: "article-2", title: "Global Economy Shows Signs of Recovery Amid Uncertainty", source: "Bloomberg", keyword: "economy", sentiment: "neutral", sentimentScore: 0.12, publishedDate: "2026-03-08T09:15:00Z", description: "Economic indicators suggest gradual recovery, though experts remain cautious about potential volatility.", bookmarked: true },
  { id: "article-3", title: "Healthcare Innovation: New Breakthrough in Cancer Treatment", source: "CNN", keyword: "healthcare", sentiment: "positive", sentimentScore: 0.89, publishedDate: "2026-03-07T16:45:00Z", description: "Researchers announce promising results from clinical trials of a new immunotherapy approach.", bookmarked: false },
  { id: "article-4", title: "Election Updates: Key Battleground States to Watch", source: "AP News", keyword: "election", sentiment: "neutral", sentimentScore: 0.05, publishedDate: "2026-03-06T11:20:00Z", description: "Analysts identify crucial swing states that could determine the outcome of upcoming elections.", bookmarked: false },
  { id: "article-5", title: "Artificial Intelligence in Healthcare: Promise and Challenges", source: "The Guardian", keyword: "ai", sentiment: "neutral", sentimentScore: 0.22, publishedDate: "2026-03-05T08:00:00Z", description: "AI diagnostic tools show great potential but raise questions about data privacy and accuracy.", bookmarked: false },
  { id: "article-6", title: "Climate Change: Arctic Ice Melting Faster Than Expected", source: "Reuters", keyword: "climate", sentiment: "negative", sentimentScore: -0.78, publishedDate: "2026-03-04T13:30:00Z", description: "New satellite data reveals accelerated ice loss in Arctic regions, concerning scientists worldwide.", bookmarked: true },
  { id: "article-7", title: "Tech Giants Report Strong Quarterly Earnings", source: "CNBC", keyword: "economy", sentiment: "positive", sentimentScore: 0.56, publishedDate: "2026-03-03T15:00:00Z", description: "Major technology companies exceed analyst expectations with robust revenue growth.", bookmarked: false },
  { id: "article-8", title: "Healthcare Costs Continue to Rise Across the Nation", source: "NPR", keyword: "healthcare", sentiment: "negative", sentimentScore: -0.45, publishedDate: "2026-03-02T10:45:00Z", description: "Report shows healthcare spending increasing faster than inflation, straining family budgets.", bookmarked: false },
  { id: "article-9", title: "AI-Powered Tools Transform Modern Workplace", source: "Bloomberg", keyword: "ai", sentiment: "positive", sentimentScore: 0.67, publishedDate: "2026-03-01T09:30:00Z", description: "Companies adopt AI assistants and automation tools to boost productivity and streamline operations.", bookmarked: false },
  { id: "article-10", title: "Economic Outlook: Experts Predict Steady Growth", source: "Reuters", keyword: "economy", sentiment: "positive", sentimentScore: 0.41, publishedDate: "2026-02-28T14:00:00Z", description: "Economists forecast moderate but sustained growth for the coming fiscal year.", bookmarked: false },
  { id: "article-11", title: "Climate Action: Cities Lead the Way in Sustainability", source: "The Guardian", keyword: "climate", sentiment: "positive", sentimentScore: 0.73, publishedDate: "2026-02-27T11:15:00Z", description: "Urban centers implement innovative green initiatives, setting examples for national policies.", bookmarked: false },
  { id: "article-12", title: "Election Security Measures Enhanced Nationwide", source: "CNN", keyword: "election", sentiment: "positive", sentimentScore: 0.38, publishedDate: "2026-02-26T16:30:00Z", description: "Federal and state agencies collaborate to strengthen cybersecurity for upcoming elections.", bookmarked: false },
  { id: "article-13", title: "Healthcare Access Improves in Rural Communities", source: "NPR", keyword: "healthcare", sentiment: "positive", sentimentScore: 0.52, publishedDate: "2026-02-25T08:45:00Z", description: "Telemedicine expansion brings better healthcare access to underserved rural areas.", bookmarked: true },
  { id: "article-14", title: "AI Ethics: Balancing Innovation with Responsibility", source: "BBC", keyword: "ai", sentiment: "neutral", sentimentScore: 0.08, publishedDate: "2026-02-24T12:00:00Z", description: "Tech industry grapples with ethical guidelines as AI capabilities continue to advance.", bookmarked: false },
]

function generateMockArticles(): Article[] {
  return MOCK_ARTICLES.map(article => ({ ...article }))
}
