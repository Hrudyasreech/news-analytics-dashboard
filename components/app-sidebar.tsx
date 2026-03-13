"use client"

import {
  LayoutDashboard,
  TrendingUp,
  MessageSquare,
  Heart,
  BookMarked,
  Settings,
  Newspaper,
  LogOut,
  User,
} from "lucide-react"
import type { PageType, User as UserType } from "@/app/page"
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
  user: UserType
  onLogout: () => void
}

const navItems = [
  { id: "summary" as const, label: "Summary", icon: LayoutDashboard },
  { id: "trends" as const, label: "Trends", icon: TrendingUp },
  { id: "topics" as const, label: "Topics", icon: MessageSquare },
  { id: "sentiment" as const, label: "Sentiment", icon: Heart },
  { id: "reading-list" as const, label: "Reading List", icon: BookMarked },
]

export function AppSidebar({ currentPage, onPageChange, user, onLogout }: AppSidebarProps) {
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

        {user.isAdmin && (
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

        {/* User Profile & Logout */}
        <SidebarSeparator className="mt-auto" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium text-foreground capitalize">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</span>
                  </div>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onLogout} tooltip="Logout">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
