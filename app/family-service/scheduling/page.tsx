"use client"

import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  Plus, Search, ChevronLeft, ChevronRight, Calendar, List, AlertTriangle,
  Users, Clock, CheckCircle
} from "lucide-react"

// 人员类型
type StaffType = "nanny" | "infant" | "rehab" | "housekeeper" | "elder"
const staffTypeConfig: Record<StaffType, { label: string; color: string }> = {
  nanny: { label: "月嫂", color: "bg-pink-100 text-pink-700" },
  infant: { label: "育婴师", color: "bg-blue-100 text-blue-700" },
  rehab: { label: "产康师", color: "bg-purple-100 text-purple-700" },
  housekeeper: { label: "保姆", color: "bg-green-100 text-green-700" },
  elder: { label: "养老护理", color: "bg-amber-100 text-amber-700" },
}

// 人员状态
type StaffStatus = "working" | "available" | "off" | "training"
const staffStatusConfig: Record<StaffStatus, { label: string; color: string; bgColor: string }> = {
  working: { label: "服务中", color: "text-blue-600", bgColor: "bg-blue-50" },
  available: { label: "空闲", color: "text-green-600", bgColor: "bg-green-50" },
  off: { label: "休假", color: "text-gray-500", bgColor: "bg-gray-50" },
  training: { label: "培训", color: "text-purple-600", bgColor: "bg-purple-50" },
}

// 预约状态
type BookingStatus = "booked" | "in-progress" | "completed"
const bookingStatusConfig: Record<BookingStatus, { color: string; bgColor: string }> = {
  booked: { color: "text-purple-700", bgColor: "bg-purple-100" },
  "in-progress": { color: "text-blue-700", bgColor: "bg-blue-100" },
  completed: { color: "text-gray-500", bgColor: "bg-gray-100" },
}

// Mock人员数据
interface Staff {
  id: string
  name: string
  type: StaffType
  status: StaffStatus
  consultant?: string
}

interface Booking {
  id: string
  staffId: string
  startHour: number
  duration: number
  customerName: string
  service: string
  status: BookingStatus
}

// 年度排班数据 (用于月历视图)
interface YearlySchedule {
  staffId: string
  schedules: {
    startMonth: number  // 1-12
    startDay: number
    endMonth: number
    endDay: number
    customerName: string
    status: "busy" | "scheduled"  // busy=红色已排 scheduled=蓝色待排
  }[]
}

interface PendingBooking {
  id: string
  customerName: string
  service: string
  serviceType: StaffType
  preferredTime?: string
}

// Mock数据
const mockStaff: Staff[] = [
  { id: "s1", name: "王美丽", type: "rehab", status: "working", consultant: "王顾问" },
  { id: "s2", name: "李芳芳", type: "rehab", status: "working", consultant: "李顾问" },
  { id: "s3", name: "张晓红", type: "rehab", status: "available", consultant: "王顾问" },
  { id: "s4", name: "陈秀英", type: "nanny", status: "available", consultant: "李顾问" },
  { id: "s5", name: "刘春梅", type: "nanny", status: "working", consultant: "王顾问" },
  { id: "s6", name: "赵丽娜", type: "infant", status: "off", consultant: "陈顾问" },
  { id: "s7", name: "孙小燕", type: "infant", status: "available", consultant: "王顾问" },
  { id: "s8", name: "周美华", type: "housekeeper", status: "working", consultant: "李顾问" },
  { id: "s9", name: "吴丽丽", type: "elder", status: "available", consultant: "陈顾问" },
  { id: "s10", name: "郑小敏", type: "nanny", status: "available", consultant: "王顾问" },
  { id: "s11", name: "钱小敏", type: "nanny", status: "working", consultant: "李顾问" },
]

const mockBookings: Booking[] = [
  { id: "b1", staffId: "s1", startHour: 9, duration: 2, customerName: "张女士", service: "产后康复", status: "in-progress" },
  { id: "b2", staffId: "s1", startHour: 14, duration: 2, customerName: "李女士", service: "腹直肌修复", status: "booked" },
  { id: "b3", staffId: "s1", startHour: 16, duration: 2, customerName: "吴女士", service: "产后塑形", status: "booked" },
  { id: "b4", staffId: "s2", startHour: 10, duration: 2, customerName: "王女士", service: "骨盆矫正", status: "in-progress" },
  { id: "b5", staffId: "s2", startHour: 15, duration: 2, customerName: "赵女士", service: "满月发汗", status: "booked" },
  { id: "b6", staffId: "s3", startHour: 9, duration: 2, customerName: "陈女士", service: "乳腺疏通", status: "completed" },
  { id: "b7", staffId: "s3", startHour: 12, duration: 3, customerName: "刘女士", service: "经络疏通", status: "in-progress" },
]

// Mock年度排班数据
const mockYearlySchedules: YearlySchedule[] = [
  { staffId: "s4", schedules: [
    { startMonth: 1, startDay: 5, endMonth: 2, endDay: 15, customerName: "张女士", status: "busy" },
    { startMonth: 2, startDay: 20, endMonth: 4, endDay: 10, customerName: "李女士", status: "busy" },
  ]},
  { staffId: "s5", schedules: [
    { startMonth: 1, startDay: 1, endMonth: 1, endDay: 25, customerName: "王女士", status: "busy" },
    { startMonth: 4, startDay: 1, endMonth: 4, endDay: 30, customerName: "赵女士", status: "busy" },
  ]},
  { staffId: "s6", schedules: [
    { startMonth: 3, startDay: 15, endMonth: 4, endDay: 30, customerName: "刘女士", status: "busy" },
  ]},
  { staffId: "s7", schedules: [
    { startMonth: 3, startDay: 1, endMonth: 3, endDay: 20, customerName: "陈女士", status: "scheduled" },
  ]},
  { staffId: "s8", schedules: [
    { startMonth: 2, startDay: 1, endMonth: 4, endDay: 15, customerName: "周女士", status: "busy" },
  ]},
  { staffId: "s9", schedules: [] },
  { staffId: "s10", schedules: [
    { startMonth: 1, startDay: 10, endMonth: 2, endDay: 28, customerName: "孙女士", status: "busy" },
  ]},
  { staffId: "s11", schedules: [
    { startMonth: 1, startDay: 1, endMonth: 3, endDay: 31, customerName: "钱女士", status: "busy" },
  ]},
]

const mockPendingBookings: PendingBooking[] = [
  { id: "p1", customerName: "孙女士", service: "产后修复", serviceType: "rehab", preferredTime: "下午" },
  { id: "p2", customerName: "钱女士", service: "骨盆矫正", serviceType: "rehab", preferredTime: "上午" },
  { id: "p3", customerName: "郑女士", service: "腹直肌修复", serviceType: "rehab" },
  { id: "p4", customerName: "王先生", service: "月嫂服务", serviceType: "nanny", preferredTime: "全天" },
  { id: "p5", customerName: "李太太", service: "育婴师", serviceType: "infant", preferredTime: "白班" },
]

// 时间轴设置
const HOURS = Array.from({ length: 12 }, (_, i) => 9 + i)
const HOUR_WIDTH = 90
const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
const MONTH_WIDTH = 80

// 年度月历视图组件
function YearlyCalendarView({ staff, schedules }: { staff: Staff[]; schedules: YearlySchedule[] }) {
  const currentYear = 2026
  
  // 计算每个月的天数
  const getDaysInMonth = (month: number) => {
    return new Date(currentYear, month, 0).getDate()
  }

  // 计算时间条的位置和宽度
  const getBarStyle = (schedule: YearlySchedule["schedules"][0]) => {
    const totalDays = 365
    const startDayOfYear = Array.from({ length: schedule.startMonth - 1 }, (_, i) => getDaysInMonth(i + 1)).reduce((a, b) => a + b, 0) + schedule.startDay
    const endDayOfYear = Array.from({ length: schedule.endMonth - 1 }, (_, i) => getDaysInMonth(i + 1)).reduce((a, b) => a + b, 0) + schedule.endDay
    
    const left = ((startDayOfYear - 1) / totalDays) * 100
    const width = ((endDayOfYear - startDayOfYear + 1) / totalDays) * 100
    
    return { left: `${left}%`, width: `${width}%` }
  }

  return (
    <div className="flex-1 overflow-hidden border rounded-lg">
      <div className="flex">
        {/* 人员名称列 */}
        <div className="w-36 flex-shrink-0 border-r">
          <div className="h-10 border-b bg-muted/30 flex items-center px-3 text-sm font-medium text-muted-foreground">
            服务人员
          </div>
          {staff.map(s => (
            <div
              key={s.id}
              className="h-12 border-b flex items-center gap-2 px-3 hover:bg-muted/30 cursor-pointer"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className={cn("text-xs", staffStatusConfig[s.status].bgColor)}>
                  {s.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{s.name}</div>
                <Badge 
                  variant="outline" 
                  className={cn("text-[10px] h-4 px-1", staffTypeConfig[s.type].color)}
                >
                  {staffTypeConfig[s.type].label}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* 月历网格区域 */}
        <ScrollArea className="flex-1">
          <div style={{ minWidth: MONTHS.length * MONTH_WIDTH }}>
            {/* 月份头部 */}
            <div className="flex h-10 border-b bg-muted/30">
              {MONTHS.map((month, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 border-r flex items-center justify-center text-sm text-muted-foreground"
                  style={{ width: MONTH_WIDTH }}
                >
                  {month}
                </div>
              ))}
            </div>

            {/* 人员行 - 年度甘特图 */}
            {staff.map(s => {
              const staffSchedule = schedules.find(sc => sc.staffId === s.id)
              return (
                <div key={s.id} className="relative h-12 border-b">
                  {/* 网格线 */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {MONTHS.map((_, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 border-r border-dashed"
                        style={{ width: MONTH_WIDTH }}
                      />
                    ))}
                  </div>

                  {/* 排班条 */}
                  {staffSchedule?.schedules.map((schedule, idx) => {
                    const style = getBarStyle(schedule)
                    return (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "absolute top-2 h-8 rounded cursor-pointer transition-opacity hover:opacity-80",
                                schedule.status === "busy" ? "bg-red-400" : "bg-blue-400"
                              )}
                              style={{ left: style.left, width: style.width }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <p className="font-medium">{schedule.customerName}</p>
                              <p>{schedule.startMonth}月{schedule.startDay}日 - {schedule.endMonth}月{schedule.endDay}日</p>
                              <p>{schedule.status === "busy" ? "已排班" : "待确认"}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-6 px-4 py-2 border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded bg-red-400" />
          <span>已排班(在户)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded bg-blue-400" />
          <span>待排班(预约)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded bg-gray-200" />
          <span>空档期</span>
        </div>
      </div>
    </div>
  )
}

// 日视图组件(产康师)
function DailyCalendarView({ staff, bookings, selectedDate }: { staff: Staff[]; bookings: Booking[]; selectedDate: Date }) {
  const getStaffBookings = (staffId: string) => {
    return bookings.filter(b => b.staffId === staffId)
  }

  return (
    <div className="flex-1 overflow-hidden border rounded-lg">
      <div className="flex">
        {/* 人员名称列 */}
        <div className="w-36 flex-shrink-0 border-r">
          <div className="h-10 border-b bg-muted/30 flex items-center px-3 text-sm font-medium text-muted-foreground">
            服务人员
          </div>
          {staff.map(s => (
            <div
              key={s.id}
              className="h-16 border-b flex items-center gap-2 px-3 hover:bg-muted/30 cursor-pointer"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className={cn("text-xs", staffStatusConfig[s.status].bgColor)}>
                  {s.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{s.name}</div>
                <div className="flex items-center gap-1">
                  <Badge 
                    variant="outline" 
                    className={cn("text-[10px] h-4 px-1", staffTypeConfig[s.type].color)}
                  >
                    {staffTypeConfig[s.type].label}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={cn("text-[10px] h-4 px-1", staffStatusConfig[s.status].color)}
                  >
                    {staffStatusConfig[s.status].label}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 时间网格区域 */}
        <ScrollArea className="flex-1">
          <div style={{ minWidth: HOURS.length * HOUR_WIDTH }}>
            {/* 时间轴头部 */}
            <div className="flex h-10 border-b bg-muted/30">
              {HOURS.map(hour => (
                <div
                  key={hour}
                  className="flex-shrink-0 border-r flex items-center justify-center text-sm text-muted-foreground"
                  style={{ width: HOUR_WIDTH }}
                >
                  {hour}:00
                </div>
              ))}
            </div>

            {/* 人员行 */}
            {staff.map(s => (
              <div key={s.id} className="relative h-16 border-b">
                {/* 网格线 */}
                <div className="absolute inset-0 flex pointer-events-none">
                  {HOURS.map(hour => (
                    <div
                      key={hour}
                      className="flex-shrink-0 border-r border-dashed"
                      style={{ width: HOUR_WIDTH }}
                    />
                  ))}
                </div>

                {/* 预约块 */}
                <TooltipProvider>
                  {getStaffBookings(s.id).map(booking => {
                    const left = (booking.startHour - 9) * HOUR_WIDTH
                    const width = booking.duration * HOUR_WIDTH - 4
                    const config = bookingStatusConfig[booking.status]

                    return (
                      <Tooltip key={booking.id}>
                        <TooltipTrigger asChild>
                          <button
                            className={cn(
                              "absolute top-2 h-12 rounded-md px-2 py-1 text-left overflow-hidden cursor-pointer transition-opacity hover:opacity-90",
                              config.bgColor, config.color
                            )}
                            style={{ left: left + 2, width }}
                          >
                            <div className="text-xs font-medium truncate">{booking.customerName}</div>
                            <div className="text-[10px] truncate opacity-80">{booking.service}</div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-medium">{booking.customerName}</p>
                            <p>{booking.service}</p>
                            <p>{booking.startHour}:00 - {booking.startHour + booking.duration}:00</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </TooltipProvider>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-6 px-4 py-2 border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-100" />
          <span>已预约</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-100" />
          <span>服务中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-100" />
          <span>已完成</span>
        </div>
        <span className="ml-auto text-muted-foreground">点击空闲时段可快速预约</span>
      </div>
    </div>
  )
}

export default function SchedulingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 24))
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [consultantFilter, setConsultantFilter] = useState("all")
  const [scheduleFilter, setScheduleFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")

  // 是否是产康师视图(使用日视图)
  const isRehabView = typeFilter === "rehab"

  // 筛选人员
  const filteredStaff = useMemo(() => {
    return mockStaff.filter(staff => {
      const matchType = typeFilter === "all" || staff.type === typeFilter
      const matchConsultant = consultantFilter === "all" || staff.consultant === consultantFilter
      const matchSearch = !searchTerm || staff.name.includes(searchTerm)
      const matchSchedule = scheduleFilter === "all" || 
        (scheduleFilter === "available" && staff.status === "available") ||
        (scheduleFilter === "busy" && staff.status === "working")
      return matchType && matchConsultant && matchSearch && matchSchedule
    })
  }, [typeFilter, consultantFilter, searchTerm, scheduleFilter])

  // 格式化日期
  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    return `${date.getFullYear()}年${month}月${day}日 ${weekdays[date.getDay()]}`
  }

  // 日期导航
  const goToPrevDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  const goToToday = () => {
    setSelectedDate(new Date(2026, 0, 24))
  }

  // 统计数据
  const stats = useMemo(() => {
    const total = mockStaff.length
    const working = mockStaff.filter(s => s.status === "working").length
    const available = mockStaff.filter(s => s.status === "available").length
    const pending = mockPendingBookings.length
    return { total, working, available, pending }
  }, [])

  // 空档提醒
  const idleStaff = [
    { name: "吴丽丽", days: 12, type: "elder" },
    { name: "郑小红", days: 18, type: "infant" },
    { name: "钱小敏", days: 10, type: "nanny" },
    { name: "李晓燕", days: 6, type: "rehab" },
  ]

  return (
    <AdminLayout title="档期排班">
      <div className="space-y-4">
        {/* 页面标题和统计 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">档期排班</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />{stats.total}人
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />{stats.working}服务中
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />{stats.available}待接单
              </span>
              <span className="text-blue-600">空档7天+:{idleStaff.filter(s => s.days >= 7).length}</span>
              <span className="text-orange-600">空档14天+:{idleStaff.filter(s => s.days >= 14).length}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              待排班({stats.pending})
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-1" />新增排班
            </Button>
          </div>
        </div>

        {/* 空档提醒 */}
        <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-sm">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span className="text-amber-800">空档提醒：</span>
          {idleStaff.map((staff, i) => (
            <Badge key={i} className="bg-amber-100 text-amber-800 hover:bg-amber-200">
              {staff.name}({staff.days}天)
            </Badge>
          ))}
        </div>

        {/* 筛选栏 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-40">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索人员..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue placeholder="全部类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="nanny">月嫂</SelectItem>
                <SelectItem value="infant">育婴师</SelectItem>
                <SelectItem value="rehab">产康师</SelectItem>
                <SelectItem value="housekeeper">保姆</SelectItem>
                <SelectItem value="elder">养老护理</SelectItem>
              </SelectContent>
            </Select>
            <Select value={consultantFilter} onValueChange={setConsultantFilter}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue placeholder="全部顾问" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部顾问</SelectItem>
                <SelectItem value="王顾问">王顾问</SelectItem>
                <SelectItem value="李顾问">李顾问</SelectItem>
                <SelectItem value="陈顾问">陈顾问</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scheduleFilter} onValueChange={setScheduleFilter}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue placeholder="全部档期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部档期</SelectItem>
                <SelectItem value="available">有空档</SelectItem>
                <SelectItem value="busy">已排满</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* 日期导航(仅产康师显示) */}
          {isRehabView && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 border rounded-md">
                <Button 
                  variant={viewMode === "calendar" ? "secondary" : "ghost"} 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={() => setViewMode("calendar")}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "secondary" : "ghost"} 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={goToPrevDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                今天
              </Button>
              <span className="min-w-[160px] text-center font-medium">
                {formatDate(selectedDate)}
              </span>
              <Button variant="outline" size="sm" onClick={goToNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* 年份选择器(非产康师显示) */}
          {!isRehabView && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">年度视图</span>
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">2026年</span>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* 排班主视图 */}
        <div className="flex gap-4">
          {/* 根据类型选择不同视图 */}
          {isRehabView ? (
            <DailyCalendarView 
              staff={filteredStaff} 
              bookings={mockBookings} 
              selectedDate={selectedDate}
            />
          ) : (
            <YearlyCalendarView 
              staff={filteredStaff} 
              schedules={mockYearlySchedules} 
            />
          )}

          {/* 右侧：待排班列表 */}
          <div className="w-52 border rounded-lg shrink-0">
            <div className="h-10 border-b bg-muted/30 flex items-center px-3">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">待排班({mockPendingBookings.length})</span>
            </div>
            <ScrollArea className="h-[400px]">
              <div className="p-2 space-y-2">
                {mockPendingBookings.map(booking => (
                  <div
                    key={booking.id}
                    className="p-2 border rounded-lg hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[10px] text-muted-foreground">::</span>
                      <span className="text-sm font-medium">{booking.customerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className={cn("text-[10px] h-4 px-1", staffTypeConfig[booking.serviceType].color)}>
                        {staffTypeConfig[booking.serviceType].label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{booking.service}</span>
                    </div>
                    {booking.preferredTime && (
                      <div className="text-[10px] text-blue-600 mt-1">偏好: {booking.preferredTime}</div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
