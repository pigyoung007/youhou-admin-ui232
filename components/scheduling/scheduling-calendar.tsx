"use client"

import React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { 
  ChevronLeft, ChevronRight, Clock, GripVertical, Plus, Search, Users, Briefcase, 
  CheckCircle, Phone, Eye, MoreHorizontal, MessageSquare, Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Technician {
  id: string
  name: string
  level: string
  phone: string
  status: "available" | "working" | "vacation"
  todayOrders: number
}

interface Appointment {
  id: string
  technicianId: string
  customerName: string
  service: string
  roomNo: string
  startTime: number
  duration: number
  status: "booked" | "in-service" | "completed"
  phone?: string
}

const technicians: Technician[] = [
  { id: "t1", name: "王美丽", level: "高级产康师", phone: "138****1234", status: "working", todayOrders: 3 },
  { id: "t2", name: "李芳芳", level: "金牌产康师", phone: "139****5678", status: "working", todayOrders: 2 },
  { id: "t3", name: "张晓红", level: "高级产康师", phone: "137****9012", status: "available", todayOrders: 2 },
  { id: "t4", name: "陈秀英", level: "产康师", phone: "136****3456", status: "available", todayOrders: 1 },
  { id: "t5", name: "刘春梅", level: "高级产康师", phone: "135****7890", status: "working", todayOrders: 1 },
  { id: "t6", name: "赵丽娜", level: "金牌产康师", phone: "138****2345", status: "vacation", todayOrders: 0 },
]

const appointments: Appointment[] = [
  { id: "a1", technicianId: "t1", customerName: "张女士", service: "盆底康复", roomNo: "A101", startTime: 9, duration: 1.5, status: "completed", phone: "139****1111" },
  { id: "a2", technicianId: "t1", customerName: "李女士", service: "腹直肌修复", roomNo: "B203", startTime: 14, duration: 1.5, status: "booked", phone: "139****2222" },
  { id: "a9", technicianId: "t1", customerName: "吴女士", service: "产后塑形", roomNo: "A102", startTime: 16, duration: 1, status: "booked", phone: "139****9999" },
  { id: "a3", technicianId: "t2", customerName: "王女士", service: "骨盆矫正", roomNo: "A102", startTime: 10, duration: 2, status: "in-service", phone: "139****3333" },
  { id: "a4", technicianId: "t2", customerName: "赵女士", service: "满月发汗", roomNo: "C301", startTime: 15, duration: 1.5, status: "booked", phone: "139****4444" },
  { id: "a5", technicianId: "t3", customerName: "陈女士", service: "乳腺疏通", roomNo: "B201", startTime: 9, duration: 1, status: "completed", phone: "139****5555" },
  { id: "a6", technicianId: "t3", customerName: "刘女士", service: "经络疏通", roomNo: "A103", startTime: 13, duration: 1.5, status: "in-service", phone: "139****6666" },
  { id: "a7", technicianId: "t4", customerName: "周女士", service: "产后修复", roomNo: "C302", startTime: 11, duration: 1.5, status: "booked", phone: "139****7777" },
  { id: "a8", technicianId: "t5", customerName: "孙女士", service: "体态矫正", roomNo: "B202", startTime: 14, duration: 2, status: "booked", phone: "139****8888" },
]

const pendingAppointments = [
  { id: "p1", customerName: "孙女士", service: "产后修复", preferredTime: "下午", phone: "138****1111" },
  { id: "p2", customerName: "钱女士", service: "骨盆矫正", preferredTime: "上午", phone: "138****2222" },
  { id: "p3", customerName: "郑女士", service: "腹直肌修复", preferredTime: "任意", phone: "138****3333" },
]

const timeSlots = Array.from({ length: 11 }, (_, i) => i + 9) // 9:00 - 19:00

const statusConfig = {
  booked: { label: "已预约", color: "bg-purple-500" },
  "in-service": { label: "服务中", color: "bg-blue-500" },
  completed: { label: "已完成", color: "bg-gray-400" },
}

const techStatusConfig = {
  available: { label: "空闲", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  working: { label: "服务中", color: "bg-blue-100 text-blue-700 border-blue-200" },
  vacation: { label: "休假", color: "bg-gray-100 text-gray-600 border-gray-200" },
}

// Quick arrange dialog
function ArrangeDialog({ technician, time, trigger }: { technician?: Technician; time?: number; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />新增预约</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">新增预约{technician ? ` - ${technician.name}` : ""}</DialogTitle>
          <DialogDescription className="text-xs">为产康师安排服务预约</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-3">
          {!technician && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium">选择产康师</label>
              <Select>
                <SelectTrigger className="h-8"><SelectValue placeholder="选择产康师" /></SelectTrigger>
                <SelectContent>
                  {technicians.filter(t => t.status !== "vacation").map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name} - {t.level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-medium">客户姓名</label>
            <Input placeholder="请输入客户姓名" className="h-8" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">服务项目</label>
              <Select>
                <SelectTrigger className="h-8"><SelectValue placeholder="选择项目" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pelvic">盆底康复</SelectItem>
                  <SelectItem value="rectus">腹直肌修复</SelectItem>
                  <SelectItem value="bone">骨盆矫正</SelectItem>
                  <SelectItem value="breast">乳腺疏通</SelectItem>
                  <SelectItem value="shape">产后塑形</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">服务房间</label>
              <Select>
                <SelectTrigger className="h-8"><SelectValue placeholder="选择房间" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="a101">A101</SelectItem>
                  <SelectItem value="a102">A102</SelectItem>
                  <SelectItem value="b201">B201</SelectItem>
                  <SelectItem value="b202">B202</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">开始时间</label>
              <Select defaultValue={time?.toString()}>
                <SelectTrigger className="h-8"><SelectValue placeholder="选择时间" /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map(h => (
                    <SelectItem key={h} value={h.toString()}>{h}:00</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">服务时长</label>
              <Select defaultValue="1.5">
                <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1小时</SelectItem>
                  <SelectItem value="1.5">1.5小时</SelectItem>
                  <SelectItem value="2">2小时</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="bg-transparent">取消</Button>
          <Button size="sm">确认预约</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function SchedulingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showPending, setShowPending] = useState(true)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "short" })
  }

  const goToPrevDay = () => setCurrentDate(prev => { const d = new Date(prev); d.setDate(d.getDate() - 1); return d })
  const goToNextDay = () => setCurrentDate(prev => { const d = new Date(prev); d.setDate(d.getDate() + 1); return d })
  const goToToday = () => setCurrentDate(new Date())

  const isToday = currentDate.toDateString() === new Date().toDateString()

  // Stats
  const stats = useMemo(() => ({
    total: technicians.length,
    working: technicians.filter(t => t.status === "working").length,
    available: technicians.filter(t => t.status === "available").length,
    todayAppointments: appointments.length,
    pending: pendingAppointments.length,
  }), [])

  // Filter technicians
  const filteredTechs = useMemo(() => {
    return technicians.filter(t => {
      const matchStatus = filterStatus === "all" || t.status === filterStatus
      const matchSearch = t.name.includes(searchTerm) || t.level.includes(searchTerm)
      return matchStatus && matchSearch
    })
  }, [filterStatus, searchTerm])

  // Current hour indicator
  const now = new Date()
  const currentHour = now.getHours() + now.getMinutes() / 60
  const showCurrentTime = isToday && currentHour >= 9 && currentHour <= 20

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">产康师排班</h1>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{stats.total}人</span>
            <span className="flex items-center gap-1"><Briefcase className="h-3 w-3 text-blue-500" />{stats.working}服务中</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-emerald-500" />{stats.available}空闲</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-purple-500" />{stats.todayAppointments}预约</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showPending ? "secondary" : "outline"}
            size="sm"
            className={cn("h-7 text-xs", !showPending && "bg-transparent")}
            onClick={() => setShowPending(!showPending)}
          >
            待排班 ({stats.pending})
          </Button>
          <ArrangeDialog />
        </div>
      </div>

      {/* Filters & Date Navigation */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="搜索产康师..." 
              className="pl-7 h-7 w-36 text-xs"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-20 h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="working">服务中</SelectItem>
              <SelectItem value="available">空闲</SelectItem>
              <SelectItem value="vacation">休假</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToPrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant={isToday ? "secondary" : "ghost"} 
            size="sm" 
            className="h-7 text-xs px-2" 
            onClick={goToToday}
          >
            今天
          </Button>
          <span className="text-sm font-medium w-24 text-center">{formatDate(currentDate)}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Calendar Grid */}
        <Card className="flex-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="w-28 p-1.5 text-left text-xs font-medium text-muted-foreground border-r sticky left-0 bg-muted/50 z-10">产康师</th>
                  {timeSlots.map(hour => {
                    const isCurrent = showCurrentTime && hour <= currentHour && currentHour < hour + 1
                    return (
                      <th key={hour} className={cn("w-16 p-1 text-center border-r text-xs", isCurrent && "bg-primary/10")}>
                        <span className={cn(isCurrent ? "text-primary font-bold" : "text-muted-foreground")}>{hour}:00</span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredTechs.map(tech => {
                  const techAppointments = appointments.filter(apt => apt.technicianId === tech.id)
                  return (
                    <tr key={tech.id} className="group hover:bg-muted/20 border-b">
                      <td className="p-1.5 border-r sticky left-0 bg-background z-10 group-hover:bg-muted/20">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-teal-100 text-teal-700 text-[10px]">{tech.name.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate leading-tight">{tech.name}</p>
                            <Badge variant="outline" className={cn("text-[9px] h-4 px-1", techStatusConfig[tech.status].color)}>
                              {techStatusConfig[tech.status].label}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem className="text-xs"><Phone className="h-3 w-3 mr-2" />{tech.phone}</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs"><MessageSquare className="h-3 w-3 mr-2" />发送消息</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-xs"><Eye className="h-3 w-3 mr-2" />查看详情</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs"><Calendar className="h-3 w-3 mr-2" />设置休假</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                      {timeSlots.map(hour => {
                        const apt = techAppointments.find(a => a.startTime <= hour && hour < a.startTime + a.duration)
                        const isStart = apt && apt.startTime === hour
                        const isCurrent = showCurrentTime && hour <= currentHour && currentHour < hour + 1
                        
                        if (apt && !isStart) return null // Skip cells covered by appointment
                        
                        return (
                          <td 
                            key={hour} 
                            colSpan={apt ? Math.ceil(apt.duration) : 1}
                            className={cn("p-0.5 border-r relative h-12", isCurrent && "bg-primary/5")}
                          >
                            {apt ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className={cn(
                                      "h-full rounded px-1.5 py-1 cursor-pointer transition-all hover:shadow-md text-white",
                                      statusConfig[apt.status].color
                                    )}>
                                      <p className="text-[10px] font-medium truncate">{apt.customerName}</p>
                                      <p className="text-[9px] opacity-80 truncate">{apt.service}</p>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs">
                                    <p className="font-medium">{apt.customerName} - {apt.service}</p>
                                    <p className="text-muted-foreground">{apt.startTime}:00 ~ {apt.startTime + apt.duration}:00 | {apt.roomNo}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              tech.status !== "vacation" && (
                                <ArrangeDialog 
                                  technician={tech} 
                                  time={hour}
                                  trigger={
                                    <div className="h-full w-full rounded border border-transparent hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all" />
                                  }
                                />
                              )
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-between px-3 py-1.5 border-t bg-muted/30 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-purple-500" />已预约</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-500" />服务中</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-400" />已完成</span>
            </div>
            <span className="text-muted-foreground">点击空闲时段可快速预约</span>
          </div>
        </Card>

        {/* Pending Sidebar */}
        {showPending && (
          <Card className="w-48 shrink-0">
            <div className="p-2 border-b">
              <p className="text-xs font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                待排班 ({pendingAppointments.length})
              </p>
            </div>
            <div className="p-2 space-y-1.5">
              {pendingAppointments.map(apt => (
                <div
                  key={apt.id}
                  className="flex items-center gap-2 rounded border border-dashed p-2 cursor-grab hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <GripVertical className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{apt.customerName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{apt.service}</p>
                  </div>
                </div>
              ))}
              {pendingAppointments.length === 0 && (
                <p className="text-center text-muted-foreground text-xs py-4">暂无待排班</p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
