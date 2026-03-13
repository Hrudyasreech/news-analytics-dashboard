"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Search, X, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  keywords: string[]
  setKeywords: (keywords: string[]) => void
  dateRange: { from: Date; to: Date }
  setDateRange: (range: { from: Date; to: Date }) => void
  onAnalyze: () => void
  isAnalyzing: boolean
}

export function DashboardHeader({
  keywords,
  setKeywords,
  dateRange,
  setDateRange,
  onAnalyze,
  isAnalyzing,
}: DashboardHeaderProps) {
  const [keywordInput, setKeywordInput] = useState("")

  function addKeyword() {
    if (keywordInput.trim() && keywords.length < 5 && !keywords.includes(keywordInput.trim().toLowerCase())) {
      setKeywords([...keywords, keywordInput.trim().toLowerCase()])
      setKeywordInput("")
    }
  }

  function removeKeyword(keyword: string) {
    setKeywords(keywords.filter((k) => k !== keyword))
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-2" />
      
      <div className="flex flex-1 items-center gap-4">
        {/* Keywords Input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Add keyword..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKeyword()}
              className="w-40 pl-9 bg-input border-border"
              disabled={keywords.length >= 5}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="gap-1 bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                {keyword}
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-input border-border",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM d")} -{" "}
                    {format(dateRange.to, "MMM d, yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "MMM d, yyyy")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to })
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Analyze Button */}
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing || keywords.length === 0}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Fetch & Analyze"
          )}
        </Button>
      </div>

      {/* User Avatar */}
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    </header>
  )
}
