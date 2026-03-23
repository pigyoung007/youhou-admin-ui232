"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, Plus } from "lucide-react"

// 排班时段类型
export interface ScheduleBlock {
  id: string
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD
  type: "booked" | "training" | "available" | "rest" // 已排单 | 培训中 | 可排单 | 休息
  customerName?: string
  orderNo?: string
}

interface ScheduleTimelineProps {
  schedules: ScheduleBlock[]
  startMonth?: Date // 起始月份，默认当前月
  monthCount?: number // 显示月份数，默认8个月
  compact?: boolean // 紧凑模式，用于表格列
  onAddAvailable?: () => void // 添加可服务时间
  onViewCalendar?: () => void // 查看完整日历
  className?: string
}

// 颜色配置
const blockColors = {
  booked: "bg-red-500", // 红色：已排单
  training: "bg-blue-500", // 蓝色：培训中+休息
  rest: "bg-blue-500",
  available: "bg-white border border-gray-300", // 白色：可排单
}

// 计算两个日期之间的天数
function daysBetween(start: Date, end: Date): number {
  const diffTime = end.getTime() - start.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}

// 计算日期在时间轴上的位置百分比
function getPositionPercent(date: Date, timelineStart: Date, totalDays: number): number {
  const daysDiff = daysBetween(timelineStart, date) - 1
  return Math.max(0, Math.min(100, (daysDiff / totalDays) * 100))
}

// 格式化日期为 M月D日
function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 月份标签组件
function MonthLabels({ startMonth, monthCount }: { startMonth: Date; monthCount: number }) {
  const months = []
  const current = new Date(startMonth)
  
  for (let i = 0; i < monthCount; i++) {
    months.push(new Date(current))
    current.setMonth(current.getMonth() + 1)
  }

  return (
    <div className="flex text-xs text-muted-foreground mb-1">
      {months.map((month, i) => (
        <div key={i} className="flex-1 text-center">
          {month.getMonth() + 1}月
        </div>
      ))}
    </div>
  )
}

// 紧凑版月度视图条（用于表格列）
export function CompactScheduleTimeline({ 
  schedules, 
  startMonth = new Date(),
  monthCount = 6,
  className 
}: ScheduleTimelineProps) {
  // 计算时间轴范围
  const timelineStart = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1)
  const timelineEnd = new Date(timelineStart)
  timelineEnd.setMonth(timelineEnd.getMonth() + monthCount)
  const totalDays = daysBetween(timelineStart, timelineEnd)

  return (
    <div className={cn("w-full min-w-[180px]", className)}>
      {/* 月份标签 */}
      <div className="flex text-[10px] text-muted-foreground mb-0.5">
        {Array.from({ length: Math.min(monthCount, 4) }).map((_, i) => {
          const month = new Date(timelineStart)
          month.setMonth(month.getMonth() + i)
          return (
            <div key={i} className="flex-1 text-center">
              {month.getMonth() + 1}月
            </div>
          )
        })}
      </div>
      
      {/* 时间轴条 */}
      <div className="relative h-3 bg-gray-100 rounded-sm overflow-hidden">
        {schedules.map((block) => {
          const startDate = new Date(block.startDate)
          const endDate = new Date(block.endDate)
          
          // 确保日期在时间轴范围内
          if (endDate < timelineStart || startDate > timelineEnd) return null
          
          const clampedStart = startDate < timelineStart ? timelineStart : startDate
          const clampedEnd = endDate > timelineEnd ? timelineEnd : endDate
          
          const leftPercent = getPositionPercent(clampedStart, timelineStart, totalDays)
          const rightPercent = getPositionPercent(clampedEnd, timelineStart, totalDays)
          const widthPercent = rightPercent - leftPercent
          
          return (
            <div
              key={block.id}
              className={cn(
                "absolute top-0 h-full",
                blockColors[block.type]
              )}
              style={{
                left: `${leftPercent}%`,
                width: `${Math.max(widthPercent, 1)}%`,
              }}
              title={`${block.customerName || block.type}: ${formatShortDate(block.startDate)} - ${formatShortDate(block.endDate)}`}
            />
          )
        })}
      </div>
    </div>
  )
}

// 完整版月度视图条（用于详情面板）
export function FullScheduleTimeline({
  schedules,
  startMonth = new Date(),
  monthCount = 8,
  onAddAvailable,
  onViewCalendar,
  className,
}: ScheduleTimelineProps) {
  // 计算时间轴范围
  const timelineStart = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1)
  const timelineEnd = new Date(timelineStart)
  timelineEnd.setMonth(timelineEnd.getMonth() + monthCount)
  const totalDays = daysBetween(timelineStart, timelineEnd)

  return (
    <div className={cn("space-y-3", className)}>
      {/* 标题和操作 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">视图条（月度）</span>
        {onAddAvailable && (
          <Button variant="link" size="sm" className="text-red-500 h-auto p-0" onClick={onAddAvailable}>
            <Plus className="h-3 w-3 mr-1" />添加可服务时间
          </Button>
        )}
      </div>

      {/* 月份标签 */}
      <MonthLabels startMonth={timelineStart} monthCount={monthCount} />

      {/* 时间轴条 */}
      <div className="relative h-5 bg-gray-100 rounded overflow-hidden border">
        {schedules.map((block) => {
          const startDate = new Date(block.startDate)
          const endDate = new Date(block.endDate)
          
          // 确保日期在时间轴范围内
          if (endDate < timelineStart || startDate > timelineEnd) return null
          
          const clampedStart = startDate < timelineStart ? timelineStart : startDate
          const clampedEnd = endDate > timelineEnd ? timelineEnd : endDate
          
          const leftPercent = getPositionPercent(clampedStart, timelineStart, totalDays)
          const rightPercent = getPositionPercent(clampedEnd, timelineStart, totalDays)
          const widthPercent = rightPercent - leftPercent
          const blockDays = daysBetween(new Date(block.startDate), new Date(block.endDate))
          
          return (
            <div
              key={block.id}
              className={cn(
                "absolute top-0 h-full flex items-center justify-center",
                blockColors[block.type]
              )}
              style={{
                left: `${leftPercent}%`,
                width: `${Math.max(widthPercent, 1)}%`,
              }}
              title={`${block.customerName || block.type}: ${formatShortDate(block.startDate)} - ${formatShortDate(block.endDate)}`}
            />
          )
        })}
      </div>

      {/* 日期标注 - 显示>5天的时段起止日期 */}
      <div className="relative h-4">
        {schedules.map((block) => {
          const startDate = new Date(block.startDate)
          const endDate = new Date(block.endDate)
          const blockDays = daysBetween(startDate, endDate)
          
          if (blockDays <= 5) return null
          if (endDate < timelineStart || startDate > timelineEnd) return null
          
          const clampedStart = startDate < timelineStart ? timelineStart : startDate
          const leftPercent = getPositionPercent(clampedStart, timelineStart, totalDays)
          
          return (
            <div
              key={`label-${block.id}`}
              className="absolute text-[10px] text-muted-foreground whitespace-nowrap"
              style={{ left: `${leftPercent}%` }}
            >
              {formatShortDate(block.startDate)}
              <span className="ml-2">{formatShortDate(block.endDate)}</span>
            </div>
          )
        })}
      </div>

      {/* 图例说明 */}
      <div className="p-3 border rounded-lg bg-muted/30 text-xs text-muted-foreground space-y-1">
        <p>5天以上展示起始日期、截止日期及天数</p>
        <p>5天以内展示色块</p>
        <div className="pt-2 space-y-1">
          <p className="font-medium">色块分三类：</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm" />
            <span>红色：已排单</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-sm" />
            <span>蓝色：培训中+休息</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border border-gray-300 rounded-sm" />
            <span>白色：可排单</span>
          </div>
        </div>
      </div>

      {/* 查看完整日历按钮 */}
      {onViewCalendar && (
        <Button variant="outline" className="w-full" onClick={onViewCalendar}>
          <Calendar className="h-4 w-4 mr-2" />
          查看完整排班日历
        </Button>
      )}
    </div>
  )
}

// 默认导出紧凑版
export default CompactScheduleTimeline
