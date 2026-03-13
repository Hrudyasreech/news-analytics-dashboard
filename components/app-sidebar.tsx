"use client"

import {
  LayoutDashboard,
  TrendingUp,
  MessageSquare,
  Heart,
  BookMarked,
  Settings,
  Newspaper,
} from "lucide-react"
import type { PageType } from "@/app/page"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  currentPage: PageType
  onPageChange: (page: PageType) => void
  isAdmin: boolean
}

const navItems = [
  { id: "summary" as const, label: "Summary", icon: LayoutDashboard },
  { id: "trends" as const, label: "Trends", icon: TrendingUp },
  { id: "topics" as const, label: "Topics", icon: MessageSquare },
  { id: "sentiment" as const, label: "Sentiment", icon: Heart },
  { id: "reading-list" as const, label: "Reading List", icon: BookMarked },
]

export function AppSidebar({ currentPage, onPageChange, isAdmin }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border pb-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Newspaper className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-semibold text-foreground">NewsLens</span>
            <span className="text-xs text-muted-foreground">NLP Analytics</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => onPageChange(item.id)}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={currentPage === "admin"}
                      onClick={() => onPageChange("admin")}
                      tooltip="Admin Dashboard"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
