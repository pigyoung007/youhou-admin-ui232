"use client"

import React from "react"

import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  ClipboardList,
  Clock,
  Check,
  AlertCircle,
  MapPin,
  Phone,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Eye,
  Play,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  MessageSquare,
  Navigation,
  Briefcase,
  Users,
  LayoutGrid,
  List,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { cn } from "@/lib/utils"

interface WorkOrder {
  id: string
  orderNo: string
  type: "maternity" | "infant_care" | "postpartum"
  employer: { name: string; phone: string; address: string }
  caregiver: { name: string; role: string; phone: string }
  status: "pending" | "in_service" | "completed" | "cancelled"
  serviceDate: string
  serviceTime: string
  checkInTime?: string
  checkOutTime?: string
  notes?: string
}

const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO001",
    orderNo: "WO202501230001",
    type: "maternity",
    employer: { name: "张女士", phone: "138****1234", address: "银川市金凤区某小区A栋1201" },
    caregiver: { name: "李春华", role: "金牌月嫂", phone: "139****5678" },
    status: "in_service",
    serviceDate: "2025-01-23",
    serviceTime: "08:00-18:00",
    checkInTime: "08:05",
  },
  {
    id: "WO002",
    orderNo: "WO202501230002",
    type: "postpartum",
    employer: { name: "刘女士", phone: "139****5678", address: "银川市兴庆区某小区B栋801" },
    caregiver: { name: "张美玲", role: "产康技师", phone: "137****9012" },
    status: "pending",
    serviceDate: "2025-01-23",
    serviceTime: "14:00-16:00",
  },
  {
    id: "WO003",
    orderNo: "WO202501230003",
    type: "infant_care",
    employer: { name: "王先生", phone: "137****9012", address: "银川市西夏区某小区C栋502" },
    caregiver: { name: "王秀兰", role: "高级育婴师", phone: "136****3456" },
    status: "completed",
    serviceDate: "2025-01-23",
    serviceTime: "08:00-18:00",
    checkInTime: "07:55",
    checkOutTime: "18:10",
  },
  {
    id: "WO004",
    orderNo: "WO202501220001",
    type: "maternity",
    employer: { name: "陈女士", phone: "136****3456", address: "银川市金凤区某小区D栋1501" },
    caregiver: { name: "周小红", role: "月嫂", phone: "135****7890" },
    status: "cancelled",
    serviceDate: "2025-01-22",
    serviceTime: "08:00-18:00",
    notes: "客户临时取消",
  },
  {
    id: "WO005",
    orderNo: "WO202501230004",
    type: "maternity",
    employer: { name: "赵女士", phone: "135****7890", address: "银川市兴庆区某小区E栋301" },
    caregiver: { name: "吴美华", role: "金牌月嫂", phone: "138****2345" },
    status: "in_service",
    serviceDate: "2025-01-23",
    serviceTime: "08:00-18:00",
    checkInTime: "07:58",
  },
  {
    id: "WO006",
    orderNo: "WO202501230005",
    type: "infant_care",
    employer: { name: "孙女士", phone: "138****2345", address: "银川市西夏区某小区F栋602" },
    caregiver: { name: "郑小红", role: "育婴师", phone: "139****6789" },
    status: "pending",
    serviceDate: "2025-01-23",
    serviceTime: "09:00-17:00",
  },
]

const typeConfig = {
  maternity: { label: "月嫂", color: "bg-rose-100 text-rose-700 border-rose-200" },
  infant_care: { label: "育婴", color: "bg-blue-100 text-blue-700 border-blue-200" },
  postpartum: { label: "产康", color: "bg-teal-100 text-teal-700 border-teal-200" },
}

const statusConfig = {
  pending: { label: "待服务", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  in_service: { label: "服务中", color: "bg-green-100 text-green-700 border-green-200", icon: Play },
  completed: { label: "已完成", color: "bg-gray-100 text-gray-600 border-gray-200", icon: CheckCircle },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
}

function WorkOrderDetailDialog({ order, trigger }: { order: WorkOrder; trigger?: React.ReactNode }) {
  const StatusIcon = statusConfig[order.status].icon
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Eye className="h-3.5 w-3.5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">{order.orderNo}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className={cn("text-[10px] h-5", typeConfig[order.type].color)}>
                {typeConfig[order.type].label}
              </Badge>
              <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[order.status].color)}>
                <StatusIcon className="h-3 w-3 mr-0.5" />
                {statusConfig[order.status].label}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Parties - Two columns */}
          <div className="grid grid-cols-2 gap-2">
            {/* Employer */}
            <div className="p-2.5 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-1 mb-2">
                <User className="h-3 w-3 text-blue-600" />
                <span className="text-[10px] text-muted-foreground">雇主</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-[10px]">
                    {order.employer.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{order.employer.name}</p>
                  <p className="text-[10px] text-muted-foreground">{order.employer.phone}</p>
                </div>
              </div>
            </div>
            {/* Caregiver */}
            <div className="p-2.5 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-1 mb-2">
                <User className="h-3 w-3 text-rose-600" />
                <span className="text-[10px] text-muted-foreground">服务人员</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-rose-100 text-rose-700 text-[10px]">
                    {order.caregiver.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{order.caregiver.name}</p>
                  <p className="text-[10px] text-muted-foreground">{order.caregiver.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Address */}
          <div className="p-2.5 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-1 mb-1.5">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">服务地址</span>
            </div>
            <p className="text-xs">{order.employer.address}</p>
          </div>

          {/* Service Time */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-muted/30">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">服务日期</span>
              </div>
              <p className="text-xs font-medium">{order.serviceDate}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/30">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">服务时段</span>
              </div>
              <p className="text-xs font-medium">{order.serviceTime}</p>
            </div>
          </div>

          {/* Check-in/out */}
          {(order.checkInTime || order.checkOutTime) && (
            <div className="p-2.5 rounded-lg border border-green-200 bg-green-50">
              <div className="flex items-center gap-1 mb-1.5">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-[10px] text-green-700">打卡记录</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {order.checkInTime && (
                  <span>签到: <span className="font-medium text-green-700">{order.checkInTime}</span></span>
                )}
                {order.checkOutTime && (
                  <span>签退: <span className="font-medium text-green-700">{order.checkOutTime}</span></span>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50">
              <div className="flex items-center gap-1 mb-1">
                <AlertCircle className="h-3 w-3 text-amber-600" />
                <span className="text-[10px] text-amber-700">备注</span>
              </div>
              <p className="text-xs text-amber-800">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="px-4 py-2.5 border-t shrink-0 bg-muted/30">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-1.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent">
                      <Phone className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>联系雇主</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent">
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>发送消息</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-1.5">
              {order.status === "in_service" && (
                <Button size="sm" className="h-7 text-xs">
                  <Navigation className="h-3 w-3 mr-1" />
                  实时定位
                </Button>
              )}
              {order.status === "pending" && (
                <Button size="sm" className="h-7 text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  提醒服务
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Loading() {
  return null
}

export default function WorkOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const searchParams = useSearchParams()

  const filteredOrders = useMemo(() => {
    return mockWorkOrders.filter((o) => {
      const matchStatus = activeTab === "all" || o.status === activeTab
      const matchType = typeFilter === "all" || o.type === typeFilter
      const matchSearch = !searchTerm || 
        o.orderNo.includes(searchTerm) || 
        o.employer.name.includes(searchTerm) ||
        o.caregiver.name.includes(searchTerm)
      return matchStatus && matchType && matchSearch
    })
  }, [activeTab, typeFilter, searchTerm])

  // Stats
  const stats = useMemo(() => ({
    pending: mockWorkOrders.filter(o => o.status === "pending").length,
    inService: mockWorkOrders.filter(o => o.status === "in_service").length,
    completed: mockWorkOrders.filter(o => o.status === "completed").length,
    total: mockWorkOrders.length,
  }), [])

  return (
    <AdminLayout>
      <Suspense fallback={<Loading />}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">服务工单</h1>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{stats.total}单</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" />{stats.pending}待服务</span>
                <span className="flex items-center gap-1"><Play className="h-3 w-3 text-green-500" />{stats.inService}服务中</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-gray-400" />{stats.completed}已完成</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 border rounded-lg p-0.5">
              <Button
                variant={viewMode === "card" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewMode("card")}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewMode("table")}
              >
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs h-6 px-2.5">全部</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs h-6 px-2.5">待服务</TabsTrigger>
                <TabsTrigger value="in_service" className="text-xs h-6 px-2.5">服务中</TabsTrigger>
                <TabsTrigger value="completed" className="text-xs h-6 px-2.5">已完成</TabsTrigger>
                <TabsTrigger value="cancelled" className="text-xs h-6 px-2.5">已取消</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="搜索工单/客户..." 
                  className="pl-7 h-7 w-40 text-xs"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-24 h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="maternity">月嫂服务</SelectItem>
                  <SelectItem value="infant_care">育婴服务</SelectItem>
                  <SelectItem value="postpartum">产康服务</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Work Orders - Card View */}
          {viewMode === "card" && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon
                return (
                  <Card key={order.id} className="p-3 hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5", typeConfig[order.type].color)}>
                          {typeConfig[order.type].label}
                        </Badge>
                        <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5", statusConfig[order.status].color)}>
                          <StatusIcon className="h-3 w-3 mr-0.5" />
                          {statusConfig[order.status].label}
                        </Badge>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">{order.orderNo.slice(-6)}</span>
                    </div>

                    {/* Parties */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-[10px]">
                            {order.employer.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{order.employer.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{order.employer.phone}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-rose-100 text-rose-700 text-[10px]">
                            {order.caregiver.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{order.caregiver.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{order.caregiver.role}</p>
                        </div>
                      </div>
                    </div>

                    {/* Time & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Calendar className="h-3 w-3" />
                          {order.serviceDate.slice(5)}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {order.serviceTime}
                        </span>
                        {order.checkInTime && (
                          <span className="text-green-600">已签到</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <WorkOrderDetailDialog order={order} />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem className="text-xs"><Phone className="h-3 w-3 mr-2" />联系雇主</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs"><MessageSquare className="h-3 w-3 mr-2" />发送消息</DropdownMenuItem>
                            {order.status === "in_service" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-xs"><Navigation className="h-3 w-3 mr-2" />实时定位</DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Work Orders - Table View */}
          {viewMode === "table" && (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs w-24">工单号</TableHead>
                    <TableHead className="text-xs">类型</TableHead>
                    <TableHead className="text-xs">状态</TableHead>
                    <TableHead className="text-xs">雇主</TableHead>
                    <TableHead className="text-xs">服务人员</TableHead>
                    <TableHead className="text-xs">服务日期</TableHead>
                    <TableHead className="text-xs">时段</TableHead>
                    <TableHead className="text-xs">打卡</TableHead>
                    <TableHead className="text-xs w-20">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon
                    return (
                      <TableRow key={order.id} className="group">
                        <TableCell className="font-mono text-[10px]">{order.orderNo.slice(-6)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] h-5", typeConfig[order.type].color)}>
                            {typeConfig[order.type].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[10px] h-5", statusConfig[order.status].color)}>
                            <StatusIcon className="h-3 w-3 mr-0.5" />
                            {statusConfig[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{order.employer.name}</TableCell>
                        <TableCell className="text-xs">{order.caregiver.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{order.serviceDate.slice(5)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{order.serviceTime}</TableCell>
                        <TableCell>
                          {order.checkInTime ? (
                            <span className="text-[10px] text-green-600">{order.checkInTime}</span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <WorkOrderDetailDialog order={order} />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem className="text-xs"><Phone className="h-3 w-3 mr-2" />联系雇主</DropdownMenuItem>
                                <DropdownMenuItem className="text-xs"><MessageSquare className="h-3 w-3 mr-2" />发送消息</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              共 <span className="font-medium text-foreground">{filteredOrders.length}</span> 条
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent" disabled>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button variant="default" size="icon" className="h-7 w-7">1</Button>
              <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent">
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Suspense>
    </AdminLayout>
  )
}
