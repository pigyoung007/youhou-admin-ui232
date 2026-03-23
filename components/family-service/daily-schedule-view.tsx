'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, addDays, startOfDay } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export interface DailyScheduleSlot {
  id: string
  techId: string
  techName: string
  techStatus: 'available' | 'working' | 'break' | 'training' | 'off'
  startTime: string // HH:mm
  endTime: string // HH:mm
  customerName?: string
  service?: string
  status: 'booked' | 'available' | 'training' | 'maintenance'
  color: string
}

export interface DailyScheduleViewProps {
  date: Date
  slots: DailyScheduleSlot[]
  onDateChange: (date: Date) => void
  onSlotClick: (slot: DailyScheduleSlot) => void
  onAddSlot: (time: string) => void
}

const HOUR_HEIGHT = 60
const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => {
  const hour = 9 + i
  return `${hour.toString().padStart(2, '0')}:00`
})

export function DailyScheduleView({
  date,
  slots,
  onDateChange,
  onSlotClick,
  onAddSlot,
}: DailyScheduleViewProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null)

  // 获取唯一的技师列表
  const techs = Array.from(
    new Map(slots.map(s => [s.techId, s])).values()
  ).map(s => ({ id: s.techId, name: s.techName, status: s.techStatus }))

  // 为指定技师获取时间段
  const getTechSlots = (techId: string) => {
    return slots.filter(s => s.techId === techId).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  // 计算时间段在网格中的位置
  const getSlotPosition = (startTime: string) => {
    const [hour, min] = startTime.split(':').map(Number)
    const totalMinutes = (hour - 9) * 60 + min
    return totalMinutes
  }

  // 计算时间段的高度
  const getSlotHeight = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    const minutes = (endHour - startHour) * 60 + (endMin - startMin)
    return Math.max(minutes / 60 * HOUR_HEIGHT, 30)
  }

  const statusConfig = {
    available: { label: '空闲', color: 'bg-green-50 border-green-200' },
    working: { label: '服务中', color: 'bg-blue-50 border-blue-200' },
    break: { label: '休息', color: 'bg-gray-50 border-gray-200' },
    training: { label: '培训', color: 'bg-purple-50 border-purple-200' },
    off: { label: '休假', color: 'bg-red-50 border-red-200' },
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 日期导航 */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDateChange(addDays(date, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[160px] text-center font-medium">
            {format(date, 'yyyy年M月d日 EEEE', { locale: zhCN })}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDateChange(addDays(date, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />新增预约
        </Button>
      </div>

      <div className="flex gap-4">
        {/* 左侧：技师列表 */}
        <div className="w-32 flex-shrink-0">
          <div className="space-y-2">
            <div className="font-medium text-sm px-2 py-1">技师(共{techs.length}人)</div>
            <ScrollArea className="h-[600px] rounded border">
              <div className="space-y-1 p-2">
                {techs.map(tech => (
                  <div
                    key={tech.id}
                    onClick={() => setSelectedTech(selectedTech === tech.id ? null : tech.id)}
                    className={cn(
                      'p-2 rounded cursor-pointer text-sm flex items-center gap-1 transition-colors',
                      selectedTech === tech.id
                        ? 'bg-primary/10 border border-primary'
                        : 'hover:bg-muted border border-transparent'
                    )}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{tech.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{tech.name}</div>
                      <Badge variant="outline" className="text-[10px] h-4">
                        {statusConfig[tech.status].label}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* 中间：时间网格 */}
        <div className="flex-1 min-w-0">
          <ScrollArea className="h-[600px] w-full">
            <div className="relative">
              {/* 时间轴标签 */}
              <div className="sticky top-0 bg-background border-b flex gap-1 z-10">
                {TIME_SLOTS.map(time => (
                  <div
                    key={time}
                    className="min-w-24 text-center text-xs py-2 border-r flex-shrink-0 font-medium"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* 技师行 */}
              <div className="space-y-0.5">
                {techs.map(tech => (
                  <div
                    key={tech.id}
                    className={cn(
                      'relative border-b',
                      selectedTech === tech.id ? 'bg-primary/5' : ''
                    )}
                    style={{ minHeight: `${HOUR_HEIGHT * 2}px` }}
                  >
                    {/* 小时网格线 */}
                    <div className="flex gap-1 absolute inset-0 pointer-events-none">
                      {TIME_SLOTS.map(time => (
                        <div
                          key={time}
                          className="min-w-24 border-r flex-shrink-0"
                          style={{ height: `${HOUR_HEIGHT}px` }}
                        />
                      ))}
                    </div>

                    {/* 时间段块 */}
                    <div className="relative h-full">
                      {getTechSlots(tech.id).map(slot => {
                        const top = getSlotPosition(slot.startTime)
                        const height = getSlotHeight(slot.startTime, slot.endTime)
                        const left = TIME_SLOTS.findIndex(t => t === slot.startTime.slice(0, 5)) * (24 * 4 + 4)

                        return (
                          <button
                            key={slot.id}
                            onClick={() => onSlotClick(slot)}
                            className={cn(
                              'absolute left-1 right-1 rounded p-1 text-xs cursor-pointer transition-opacity hover:opacity-90 border',
                              slot.status === 'booked'
                                ? 'bg-blue-100 border-blue-300 text-blue-900'
                                : slot.status === 'training'
                                  ? 'bg-purple-100 border-purple-300 text-purple-900'
                                  : 'bg-white border-gray-200 text-gray-600'
                            )}
                            style={{
                              top: `${(top / 60) * HOUR_HEIGHT}px`,
                              height: `${height}px`,
                            }}
                          >
                            <div className="font-medium truncate">{slot.customerName || '待安排'}</div>
                            {slot.service && <div className="text-[10px] truncate">{slot.service}</div>}
                            <div className="text-[10px]">{slot.startTime} - {slot.endTime}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* 右侧：待排班列表 */}
        <div className="w-40 flex-shrink-0 border-l pl-4">
          <div className="font-medium text-sm mb-3">待排班({slots.filter(s => s.status === 'available').length})</div>
          <ScrollArea className="h-[600px]">
            <div className="space-y-2 pr-4">
              {slots
                .filter(s => s.status === 'available')
                .map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => onSlotClick(slot)}
                    className="w-full text-left p-2 rounded border border-dashed hover:border-solid hover:bg-muted transition-all text-sm"
                  >
                    <div className="font-medium">{slot.customerName || '新预约'}</div>
                    <div className="text-xs text-muted-foreground">{slot.startTime}</div>
                  </button>
                ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
