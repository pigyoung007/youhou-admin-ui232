"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-60">
        <Header />
        <main className="p-4 lg:p-6 pt-16 lg:pt-6">{children}</main>
      </div>
    </div>
  )
}
