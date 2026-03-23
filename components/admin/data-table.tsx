"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableWrapperProps {
  title?: string
  children: React.ReactNode
  className?: string
  headerActions?: React.ReactNode
}

export function DataTableWrapper({ title, children, className, headerActions }: DataTableWrapperProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {title && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {headerActions}
        </CardHeader>
      )}
      <CardContent className={cn("p-0", title && "pt-0")}>
        {children}
      </CardContent>
    </Card>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = []
  const showEllipsis = totalPages > 5

  if (showEllipsis) {
    if (currentPage <= 3) {
      for (let i = 1; i <= Math.min(4, totalPages); i++) pages.push(i)
      if (totalPages > 4) pages.push(-1, totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, -1)
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1, -1, currentPage - 1, currentPage, currentPage + 1, -2, totalPages)
    }
  } else {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  }

  return (
    <div className={cn("flex items-center justify-between px-2 py-4", className)}>
      <p className="text-sm text-muted-foreground">
        共 <span className="font-medium text-foreground">{totalItems}</span> 条记录
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pages.map((page, idx) =>
          page < 0 ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface FilterBarProps {
  children: React.ReactNode
  className?: string
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap", className)}>
      {children}
    </div>
  )
}
