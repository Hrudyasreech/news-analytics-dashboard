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
  id: string
  email: string
  name: string
  isAdmin: boolean
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  loginType: "user" | "admin"
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  error?: string
}

export interface ArticlesResponse {
  success: boolean
  articles?: Article[]
  error?: string
}

export interface AnalyzeRequest {
  keywords: string[]
  dateFrom: string
  dateTo: string
}

export type PageType = "summary" | "trends" | "topics" | "sentiment" | "reading-list" | "admin"
