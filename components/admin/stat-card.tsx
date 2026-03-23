"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  icon: React.ElementType
  iconClassName?: string
  href?: string
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconClassName = "stat-icon-blue",
  href,
  className,
}: StatCardProps) {
  const content = (
    <Card className={cn("card-interactive group hover:shadow-sm transition-shadow", className)}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground truncate mb-0.5">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-bold tracking-tight">{value}</p>
              {change && (
                <div className="flex items-center gap-0.5">
                  {trend === "up" && <TrendingUp className="h-3 w-3 text-green-600 flex-shrink-0" />}
                  {trend === "down" && <TrendingDown className="h-3 w-3 text-red-500 flex-shrink-0" />}
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      trend === "up" && "text-green-600",
                      trend === "down" && "text-red-500",
                      trend === "neutral" && "text-muted-foreground"
                    )}
                  >
                    {change}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-white transition-transform group-hover:scale-105 flex-shrink-0",
              iconClassName
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
