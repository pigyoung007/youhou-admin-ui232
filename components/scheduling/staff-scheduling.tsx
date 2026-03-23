"use client"

import React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Phone,
  User,
  Star,
  Plus,
  CalendarDays,
  List,
  MoreHorizontal,
  Eye,
  Clock,
  MapPin,
  MessageSquare,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Briefcase,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface StaffSchedule {
  id: string
  startDate: string // 合同约定开始时间
  endDate: string // 合同约定结束时间
  actualStartDate?: string // 实际上户时间
  actualEndDate?: string // 实际下户时间
  customer: string
  status: "working" | "booked" | "completed" | "rest"
  location?: string
  phone?: string
  contractId?: string
  note?: string
}

export interface SchedulingStaff {
  id: string
  name: string
  level: string
  rating: number
  phone: string
  status: "working" | "available" | "gap" | "vacation"
  price?: string
  gapDays?: number
  nextAvailable?: string
  currentGap?: { from: string; to: string }
  currentOrder?: { customer: string; endDate: string; location?: string }
  schedule: StaffSchedule[]
  // 档期管理相关字段
  consultant?: string // 关联顾问
  consultantId?: string
  availableDate?: string // 可接单日期
  lastClient?: string // 上一个客户
  lastEndDate?: string // 上一单结束日期
  notes?: string // 备注
}

interface StaffSchedulingProps {
  title: string
  staffList: SchedulingStaff[]
  avatarColor?: string
  statusConfig?: Record<string, { label: string; color: string }>
}

const defaultStatusConfig = {
  working: { label: "服务中", color: "bg-blue-100 text-blue-700 border-blue-200" },
  available: { label: "待接单", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  gap: { label: "空档期", color: "bg-amber-100 text-amber-700 border-amber-200" },
  vacation: { label: "休假中", color: "bg-gray-100 text-gray-700 border-gray-200" },
  booked: { label: "已预约", color: "bg-purple-100 text-purple-700 border-purple-200" },
  completed: { label: "已完成", color: "bg-gray-100 text-gray-600 border-gray-200" },
}

// Generate calendar days for a month
function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days: (Date | null)[] = []
  
  // Pad with nulls for days before the 1st
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null)
  }
  
  // Add all days of the month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  
  return days
}

// Arrange schedule dialog
function ArrangeDialog({ staff, date, trigger }: { staff?: SchedulingStaff; date?: Date; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            安排
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">安排排班{staff ? ` - ${staff.name}` : ""}</DialogTitle>
          <DialogDescription className="text-xs">为人员安排新的服务订单</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-3">
          {!staff && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium">选择人员</label>
              <Select>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="选择服务人员" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="n1">李春华 - 金牌月嫂</SelectItem>
                  <SelectItem value="n2">王秀兰 - 高级月嫂</SelectItem>
                  <SelectItem value="n3">张美玲 - 金牌月嫂</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-medium">选择客户</label>
            <Select>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="搜索或选择客户" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">刘女士 - 预产期 2025-02-20</SelectItem>
                <SelectItem value="c2">王女士 - 预产期 2025-03-05</SelectItem>
                <SelectItem value="c3">陈女士 - 预产期 2025-03-15</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">开始日期</label>
              <Input type="date" className="h-9" defaultValue={date?.toISOString().slice(0, 10)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">结束日期</label>
              <Input type="date" className="h-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium">服务地址</label>
            <Input placeholder="请输入服务地址" className="h-9" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="bg-transparent">取消</Button>
          <Button size="sm">确认安排</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 编辑排班弹窗
function EditScheduleDialog({ 
  schedule, 
  staff, 
  open, 
  onOpenChange 
}: { 
  schedule: StaffSchedule
  staff: SchedulingStaff
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [formData, setFormData] = React.useState({
    contractStart: schedule.startDate,
    contractEnd: schedule.endDate,
    actualStart: schedule.actualStartDate || "",
    actualEnd: schedule.actualEndDate || "",
    note: schedule.note || "",
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">编辑排班 - {staff.name}</DialogTitle>
          <DialogDescription className="text-xs">修改服务时间或添加备注</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3">
          {/* 客户信息 */}
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{schedule.customer}</span>
              <Badge variant="outline" className={cn("text-xs", defaultStatusConfig[schedule.status]?.color)}>
                {defaultStatusConfig[schedule.status]?.label}
              </Badge>
            </div>
            {schedule.location && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" />{schedule.location}
              </p>
            )}
          </div>

          {/* 合同周期 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">合同周期</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground">开始日期</label>
                <Input 
                  type="date" 
                  className="h-8 text-xs" 
                  value={formData.contractStart}
                  onChange={e => setFormData({...formData, contractStart: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground">结束日期</label>
                <Input 
                  type="date" 
                  className="h-8 text-xs" 
                  value={formData.contractEnd}
                  onChange={e => setFormData({...formData, contractEnd: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* 实际服务时间 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs font-medium text-green-600">实际服务时间</span>
              <span className="text-[10px] text-muted-foreground">(以上户/下户时间为准)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground">实际上户</label>
                <Input 
                  type="date" 
                  className="h-8 text-xs" 
                  value={formData.actualStart}
                  onChange={e => setFormData({...formData, actualStart: e.target.value})}
                  placeholder="待上户"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground">实际下户</label>
                <Input 
                  type="date" 
                  className="h-8 text-xs" 
                  value={formData.actualEnd}
                  onChange={e => setFormData({...formData, actualEnd: e.target.value})}
                  placeholder="服务中"
                />
              </div>
            </div>
          </div>

          {/* 备注 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium">备注</label>
            <Input 
              placeholder="添加备注信息..." 
              className="h-8 text-xs" 
              value={formData.note}
              onChange={e => setFormData({...formData, note: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="bg-transparent" onClick={() => onOpenChange(false)}>取消</Button>
          <Button size="sm">保存修改</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 设置休息弹窗
function SetRestDialog({ 
  staff, 
  open, 
  onOpenChange 
}: { 
  staff: SchedulingStaff
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [formData, setFormData] = React.useState({
    startDate: "",
    endDate: "",
    reason: "personal" as "personal" | "training" | "health" | "other",
    note: "",
  })

  const reasonOptions = {
    personal: "个人事假",
    training: "培训学习",
    health: "身体原因",
    other: "其他原因",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">设置休息 - {staff.name}</DialogTitle>
          <DialogDescription className="text-xs">为员工安排休息时间</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">开始日期</label>
              <Input 
                type="date" 
                className="h-8 text-xs" 
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">结束日期</label>
              <Input 
                type="date" 
                className="h-8 text-xs" 
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium">休息原因</label>
            <Select value={formData.reason} onValueChange={(v) => setFormData({...formData, reason: v as typeof formData.reason})}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(reasonOptions).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium">备注</label>
            <Input 
              placeholder="可选填写备注..." 
              className="h-8 text-xs" 
              value={formData.note}
              onChange={e => setFormData({...formData, note: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="bg-transparent" onClick={() => onOpenChange(false)}>取消</Button>
          <Button size="sm">确认设置</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 更新档期弹窗
function UpdateAvailabilityDialog({ 
  staff, 
  open, 
  onOpenChange 
}: { 
  staff: SchedulingStaff
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [formData, setFormData] = React.useState({
    availableDate: staff.availableDate || "",
    notes: staff.notes || "",
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">更新档期 - {staff.name}</DialogTitle>
          <DialogDescription className="text-xs">设置可接单日期和备注信息</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3">
          {/* 当前状态 */}
          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">当前状态</span>
              <Badge variant="outline" className={cn("text-xs", defaultStatusConfig[staff.status]?.color)}>
                {defaultStatusConfig[staff.status]?.label}
              </Badge>
            </div>
            {staff.currentOrder && (
              <div className="text-xs">
                <span className="text-muted-foreground">当前客户：</span>
                <span>{staff.currentOrder.customer}</span>
                <span className="text-muted-foreground ml-2">至 {staff.currentOrder.endDate}</span>
              </div>
            )}
            {staff.gapDays && staff.gapDays > 0 && (
              <div className="text-xs text-amber-600">
                已空档 {staff.gapDays} 天
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium">可接单日期</label>
            <Input 
              type="date" 
              className="h-8 text-xs" 
              value={formData.availableDate}
              onChange={e => setFormData({...formData, availableDate: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium">备注</label>
            <Input 
              placeholder="如：需优先安排、培训中等..." 
              className="h-8 text-xs" 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="bg-transparent" onClick={() => onOpenChange(false)}>取消</Button>
          <Button size="sm">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Quick action dropdown for staff
function StaffQuickActions({ staff, avatarColor, onSetRest, onUpdateAvailability }: { staff: SchedulingStaff; avatarColor: string; onSetRest: () => void; onUpdateAvailability: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem className="text-xs">
          <Phone className="h-3.5 w-3.5 mr-2" />
          联系 {staff.phone}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs">
          <MessageSquare className="h-3.5 w-3.5 mr-2" />
          发送消息
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs">
          <Eye className="h-3.5 w-3.5 mr-2" />
          查看详情
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs" onClick={onUpdateAvailability}>
          <Clock className="h-3.5 w-3.5 mr-2" />
          更新档期
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs" onClick={onSetRest}>
          <Calendar className="h-3.5 w-3.5 mr-2" />
          设置休息
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Day cell with schedule info
function DayCell({ 
  day, 
  staff, 
  isToday, 
  onArrange,
  onEdit,
}: { 
  day: Date
  staff: SchedulingStaff
  isToday: boolean
  onArrange: (staff: SchedulingStaff, date: Date) => void
  onEdit: (staff: SchedulingStaff, schedule: StaffSchedule) => void
}) {
  const schedules = staff.schedule.filter(s => {
    const start = new Date(s.startDate)
    const end = new Date(s.endDate)
    return day >= start && day <= end
  })
  
  const hasSchedule = schedules.length > 0
  const schedule = schedules[0]
  
  const statusColors = {
    working: "bg-blue-500",
    booked: "bg-purple-500", 
    completed: "bg-gray-400",
    rest: "bg-amber-400",
  }

  const handleClick = () => {
    if (hasSchedule) {
      onEdit(staff, schedule)
    } else {
      onArrange(staff, day)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "h-7 rounded-sm cursor-pointer transition-all border",
              hasSchedule ? `${statusColors[schedule.status]} border-transparent hover:opacity-80` : "bg-muted/30 border-transparent hover:border-primary/30 hover:bg-primary/5",
              isToday && !hasSchedule && "ring-1 ring-primary/50"
            )}
            onClick={handleClick}
          />
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[220px]">
          {hasSchedule ? (
            <div>
              <p className="font-medium">{schedule.customer}</p>
              <p className="text-muted-foreground">合同: {schedule.startDate} ~ {schedule.endDate}</p>
              {(schedule.actualStartDate || schedule.actualEndDate) && (
                <p className="text-green-600">实际: {schedule.actualStartDate || "待上户"} ~ {schedule.actualEndDate || "服务中"}</p>
              )}
              {schedule.location && <p className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{schedule.location}</p>}
              <p className="text-primary mt-1">点击编辑</p>
            </div>
          ) : (
            <p>点击安排排班</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function StaffScheduling({ 
  title, 
  staffList, 
  avatarColor = "bg-rose-100 text-rose-700",
  statusConfig = defaultStatusConfig
}: StaffSchedulingProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterConsultant, setFilterConsultant] = useState("all")
  const [filterGapDays, setFilterGapDays] = useState("all") // 空档天数筛选
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [selectedStaff, setSelectedStaff] = useState<SchedulingStaff | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [arrangeDialogOpen, setArrangeDialogOpen] = useState(false)
  const [restDialogStaff, setRestDialogStaff] = useState<SchedulingStaff | null>(null)
  const [editSchedule, setEditSchedule] = useState<{ staff: SchedulingStaff; schedule: StaffSchedule } | null>(null)
  const [updateAvailabilityStaff, setUpdateAvailabilityStaff] = useState<SchedulingStaff | null>(null)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // 获取顾问列表（去重）
  const consultantList = useMemo(() => {
    const consultants = staffList.map(s => s.consultant).filter(Boolean) as string[]
    return [...new Set(consultants)]
  }, [staffList])

  // Calculate stats with enhanced gap info
  const stats = useMemo(() => ({
    total: staffList.length,
    working: staffList.filter(s => s.status === "working").length,
    available: staffList.filter(s => s.status === "available").length,
    gap: staffList.filter(s => s.status === "gap").length,
    vacation: staffList.filter(s => s.status === "vacation").length,
    gapOver7: staffList.filter(s => s.gapDays && s.gapDays > 7).length,
    gapOver14: staffList.filter(s => s.gapDays && s.gapDays > 14).length,
  }), [staffList])

  // Gap alerts
  const gapAlerts = useMemo(() => 
    staffList.filter(s => s.status === "gap" || (s.gapDays && s.gapDays > 3)),
    [staffList]
  )

  // Filter staff with consultant and gap days
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchStatus = filterStatus === "all" || s.status === filterStatus
      const matchSearch = s.name.includes(searchTerm) || s.level.includes(searchTerm)
      const matchConsultant = filterConsultant === "all" || s.consultant === filterConsultant
      let matchGapDays = true
      if (filterGapDays === "7+") matchGapDays = (s.gapDays || 0) > 7
      else if (filterGapDays === "14+") matchGapDays = (s.gapDays || 0) > 14
      else if (filterGapDays === "gap") matchGapDays = s.status === "gap" || s.status === "available"
      return matchStatus && matchSearch && matchConsultant && matchGapDays
    })
  }, [staffList, filterStatus, searchTerm, filterConsultant, filterGapDays])

  // Calendar days
  const calendarDays = useMemo(() => getMonthDays(currentYear, currentMonth), [currentYear, currentMonth])
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"]

  const goToPrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  const goToNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  const goToToday = () => setCurrentDate(new Date())

  const handleArrange = (staff: SchedulingStaff, date: Date) => {
    setSelectedStaff(staff)
    setSelectedDate(date)
    setArrangeDialogOpen(true)
  }

  return (
    <div className="space-y-3">
      {/* Header - Compact */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">{title}</h1>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{stats.total}人</span>
            <span className="flex items-center gap-1"><Briefcase className="h-3 w-3 text-blue-500" />{stats.working}服务中</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-emerald-500" />{stats.available}待接单</span>
            {stats.gap > 0 && <span className="flex items-center gap-1 text-amber-600"><AlertCircle className="h-3 w-3" />{stats.gap}空档</span>}
            {stats.gapOver7 > 0 && <span className="flex items-center gap-1 text-orange-600">空档7天+:{stats.gapOver7}</span>}
            {stats.gapOver14 > 0 && <span className="flex items-center gap-1 text-red-600">空档14天+:{stats.gapOver14}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "calendar" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2 rounded-none"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarDays className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2 rounded-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
          <ArrangeDialog trigger={
            <Button size="sm" className="h-7 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" />
              新增排班
            </Button>
          } />
        </div>
      </div>

      {/* Gap Alerts - Inline */}
      {gapAlerts.length > 0 && (
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-md">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span className="text-xs text-amber-700">空档提醒:</span>
          <div className="flex gap-1 flex-wrap">
            {gapAlerts.slice(0, 4).map(s => (
              <span key={s.id} className="text-xs text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded cursor-pointer hover:bg-amber-200">
                {s.name}({s.gapDays || 0}天)
              </span>
            ))}
            {gapAlerts.length > 4 && <span className="text-xs text-amber-600">+{gapAlerts.length - 4}人</span>}
          </div>
        </div>
      )}

      {/* Filters & Navigation - Compact single row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="搜索人员..." 
              className="pl-7 h-7 w-36 text-xs" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-20 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="working">服务中</SelectItem>
              <SelectItem value="available">待接单</SelectItem>
              <SelectItem value="gap">空档</SelectItem>
              <SelectItem value="vacation">休假</SelectItem>
            </SelectContent>
          </Select>
          {consultantList.length > 0 && (
            <Select value={filterConsultant} onValueChange={setFilterConsultant}>
              <SelectTrigger className="w-24 h-7 text-xs">
                <SelectValue placeholder="顾问" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部顾问</SelectItem>
                {consultantList.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select value={filterGapDays} onValueChange={setFilterGapDays}>
            <SelectTrigger className="w-24 h-7 text-xs">
              <SelectValue placeholder="档期" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部档期</SelectItem>
              <SelectItem value="gap">空档/待接单</SelectItem>
              <SelectItem value="7+">空档7天+</SelectItem>
              <SelectItem value="14+">空档14天+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={goToToday}>
            今天
          </Button>
          <span className="text-sm font-medium w-20 text-center">
            {currentYear}年{currentMonth + 1}月
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="w-32 p-2 text-left text-xs font-medium text-muted-foreground border-r sticky left-0 bg-muted/50 z-10">人员</th>
                  {calendarDays.map((day, i) => {
                    if (!day) return <th key={`empty-${i}`} className="w-8 p-1 border-r bg-muted/30" />
                    const isToday = day.toDateString() === new Date().toDateString()
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6
                    return (
                      <th 
                        key={i} 
                        className={cn(
                          "w-8 p-1 text-center border-r",
                          isToday && "bg-primary/10",
                          isWeekend && "bg-muted/50"
                        )}
                      >
                        <span className={cn("text-[10px] block", isToday ? "text-primary font-bold" : "text-muted-foreground")}>
                          {day.getDate()}
                        </span>
                        <span className={cn("text-[9px] block", isWeekend ? "text-red-400" : "text-muted-foreground/60")}>
                          {weekDays[day.getDay()]}
                        </span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(staff => (
                  <tr key={staff.id} className="group hover:bg-muted/20 border-b">
                    <td className="p-1.5 border-r sticky left-0 bg-background z-10 group-hover:bg-muted/20">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className={cn("text-[10px]", avatarColor)}>
                            {staff.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate leading-tight">{staff.name}</p>
                          <Badge variant="outline" className={cn("text-[9px] h-4 px-1", statusConfig[staff.status]?.color)}>
                            {statusConfig[staff.status]?.label}
                          </Badge>
                        </div>
                        <StaffQuickActions staff={staff} avatarColor={avatarColor} onSetRest={() => setRestDialogStaff(staff)} onUpdateAvailability={() => setUpdateAvailabilityStaff(staff)} />
                      </div>
                    </td>
                    {calendarDays.map((day, i) => {
                      if (!day) return <td key={`empty-${i}`} className="p-0.5 border-r bg-muted/20" />
                      const isToday = day.toDateString() === new Date().toDateString()
                      const isWeekend = day.getDay() === 0 || day.getDay() === 6
                      return (
                        <td 
                          key={i} 
                          className={cn(
                            "p-0.5 border-r",
                            isWeekend && "bg-muted/30"
                          )}
                        >
<DayCell
                          day={day}
                          staff={staff}
                          isToday={isToday}
                          onArrange={handleArrange}
                          onEdit={(s, schedule) => setEditSchedule({ staff: s, schedule })}
                        />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/30">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-500" />服务中</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-purple-500" />已预约</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-400" />已完成</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-muted border" />空闲</span>
            </div>
            <span className="text-xs text-muted-foreground">点击空闲日期可快速排班</span>
          </div>
        </Card>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <div className="divide-y">
            {filteredStaff.map(staff => (
              <div key={staff.id} className="p-3 hover:bg-muted/20 group">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={cn("text-sm", avatarColor)}>
                      {staff.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{staff.name}</span>
                      <Badge variant="outline" className={cn("text-[10px]", statusConfig[staff.status]?.color)}>
                        {statusConfig[staff.status]?.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{staff.level}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs">{staff.rating}</span>
                      </div>
                    </div>
                    
                    {/* Current/Next Schedule */}
                    <div className="mt-2 space-y-1">
                      {staff.currentOrder && (
                        <div className="flex items-center gap-2 text-xs">
                          <Badge className="bg-blue-500 text-white text-[10px]">当前</Badge>
                          <span>{staff.currentOrder.customer}</span>
                          <span className="text-muted-foreground">至 {staff.currentOrder.endDate}</span>
                          {staff.currentOrder.location && (
                            <span className="text-muted-foreground flex items-center gap-0.5">
                              <MapPin className="h-3 w-3" />{staff.currentOrder.location}
                            </span>
                          )}
                        </div>
                      )}
                      {staff.schedule.filter(s => s.status === "booked").slice(0, 2).map(sch => (
                        <div key={sch.id} className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 text-[10px]">预约</Badge>
                          <span>{sch.customer}</span>
                          <span className="text-muted-foreground">{sch.startDate} ~ {sch.endDate}</span>
                        </div>
                      ))}
                      {staff.status === "available" && !staff.schedule.some(s => s.status === "booked") && (
                        <span className="text-xs text-emerald-600">当前空闲，可接单</span>
                      )}
                      {staff.gapDays && staff.gapDays > 0 && (
                        <span className="text-xs text-amber-600">空档 {staff.gapDays} 天 {staff.nextAvailable && `(${staff.nextAvailable} 起)`}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <Phone className="h-3 w-3 mr-1" />
                      联系
                    </Button>
                    <ArrangeDialog staff={staff} trigger={
                      <Button size="sm" className="h-7 text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        安排
                      </Button>
                    } />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Arrange Dialog - Triggered from calendar */}
      <Dialog open={arrangeDialogOpen} onOpenChange={setArrangeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">安排排班{selectedStaff ? ` - ${selectedStaff.name}` : ""}</DialogTitle>
            <DialogDescription className="text-xs">
              {selectedDate && `选择日期: ${selectedDate.toLocaleDateString("zh-CN")}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">选择客户</label>
              <Select>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="搜索或选择客户" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">刘女士 - 预产期 2025-02-20</SelectItem>
                  <SelectItem value="c2">王女士 - 预产期 2025-03-05</SelectItem>
                  <SelectItem value="c3">陈女士 - 预产期 2025-03-15</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">开始日期</label>
                <Input type="date" className="h-9" defaultValue={selectedDate?.toISOString().slice(0, 10)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">结束日期</label>
                <Input type="date" className="h-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">服务地址</label>
              <Input placeholder="请输入服务地址" className="h-9" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setArrangeDialogOpen(false)}>取消</Button>
            <Button size="sm" onClick={() => setArrangeDialogOpen(false)}>确认安排</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 设置休息弹窗 */}
      {restDialogStaff && (
        <SetRestDialog 
          staff={restDialogStaff} 
          open={!!restDialogStaff} 
          onOpenChange={(open) => !open && setRestDialogStaff(null)} 
        />
      )}

      {/* 编辑排班弹窗 */}
      {editSchedule && (
        <EditScheduleDialog
          staff={editSchedule.staff}
          schedule={editSchedule.schedule}
          open={!!editSchedule}
          onOpenChange={(open) => !open && setEditSchedule(null)}
        />
      )}

      {/* 更新档期弹窗 */}
      {updateAvailabilityStaff && (
        <UpdateAvailabilityDialog
          staff={updateAvailabilityStaff}
          open={!!updateAvailabilityStaff}
          onOpenChange={(open) => !open && setUpdateAvailabilityStaff(null)}
        />
      )}
    </div>
  )
}
