"use client"

import { useState, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  Plus, Search, Calendar, Clock, User, Phone, MapPin, MoreHorizontal,
  CheckCircle, XCircle, AlertCircle, Eye, Edit, Trash2, Users, FileText
} from "lucide-react"

// 预约状态
type AppointmentStatus = "pending" | "confirmed" | "assigned" | "in-service" | "completed" | "cancelled"
const statusConfig: Record<AppointmentStatus, { label: string; color: string }> = {
  pending: { label: "待确认", color: "bg-amber-100 text-amber-700" },
  confirmed: { label: "已确认", color: "bg-blue-100 text-blue-700" },
  assigned: { label: "已派单", color: "bg-purple-100 text-purple-700" },
  "in-service": { label: "服务中", color: "bg-green-100 text-green-700" },
  completed: { label: "已完成", color: "bg-gray-100 text-gray-600" },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-600" },
}

// 服务类型
const serviceTypes = ["月嫂服务", "育婴师服务", "产康服务", "保姆服务", "养老护理"]

// Mock预约数据
interface Appointment {
  id: string
  customerName: string
  customerPhone: string
  serviceType: string
  preferredDate: string
  preferredTime: string
  address: string
  status: AppointmentStatus
  assignedStaff?: string
  notes?: string
  source: string
  createdAt: string
}

const mockAppointments: Appointment[] = [
  { id: "APT001", customerName: "张女士", customerPhone: "188****8888", serviceType: "月嫂服务", preferredDate: "2026-04-01", preferredTime: "全天", address: "朝阳区望京SOHO", status: "pending", notes: "预产期4月5日，需要金牌月嫂", source: "线上预约", createdAt: "2026-03-17 10:30" },
  { id: "APT002", customerName: "李女士", customerPhone: "177****7777", serviceType: "产康服务", preferredDate: "2026-03-22", preferredTime: "下午", address: "海淀区中关村", status: "confirmed", notes: "产后42天，需要催乳和产后修复", source: "电话预约", createdAt: "2026-03-17 14:20" },
  { id: "APT003", customerName: "王女士", customerPhone: "166****6666", serviceType: "育婴师服务", preferredDate: "2026-04-10", preferredTime: "白天", address: "西城区金融街", status: "assigned", assignedStaff: "张阿姨", notes: "宝宝3个月，需要白班育婴师", source: "转介绍", createdAt: "2026-03-16 09:15" },
  { id: "APT004", customerName: "赵女士", customerPhone: "155****5555", serviceType: "月嫂服务", preferredDate: "2026-03-25", preferredTime: "全天", address: "东城区王府井", status: "in-service", assignedStaff: "王阿姨", source: "线上预约", createdAt: "2026-03-14 16:45" },
  { id: "APT005", customerName: "刘女士", customerPhone: "144****4444", serviceType: "保姆服务", preferredDate: "2026-03-20", preferredTime: "住家", address: "丰台区方庄", status: "completed", assignedStaff: "李阿姨", source: "老客户", createdAt: "2026-03-10 11:20" },
  { id: "APT006", customerName: "陈女士", customerPhone: "133****3333", serviceType: "养老护理", preferredDate: "2026-04-15", preferredTime: "白天", address: "通州区万达", status: "cancelled", notes: "取消原因：时间冲突", source: "电话预约", createdAt: "2026-03-15 08:30" },
]

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const filteredAppointments = useMemo(() => {
    return mockAppointments.filter(apt => {
      const matchStatus = statusFilter === "all" || apt.status === statusFilter
      const matchService = serviceFilter === "all" || apt.serviceType === serviceFilter
      const matchSearch = !searchTerm || apt.customerName.includes(searchTerm) || apt.customerPhone.includes(searchTerm)
      return matchStatus && matchService && matchSearch
    })
  }, [statusFilter, serviceFilter, searchTerm])

  // 统计数据
  const stats = useMemo(() => ({
    total: mockAppointments.length,
    pending: mockAppointments.filter(a => a.status === "pending").length,
    confirmed: mockAppointments.filter(a => a.status === "confirmed").length,
    inService: mockAppointments.filter(a => a.status === "in-service").length,
  }), [])

  const handleAssign = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setAssignDialogOpen(true)
  }

  return (
    <AdminLayout title="服务预约管理">
      <div className="space-y-4">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总预约数</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </Card>
          <Card className="p-4 border-amber-200 bg-amber-50/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700">待确认</p>
                <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-400" />
            </div>
          </Card>
          <Card className="p-4 border-blue-200 bg-blue-50/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">已确认待派单</p>
                <p className="text-2xl font-bold text-blue-700">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </Card>
          <Card className="p-4 border-green-200 bg-green-50/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">服务中</p>
                <p className="text-2xl font-bold text-green-700">{stats.inService}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </Card>
        </div>

        {/* 筛选栏 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索客户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 w-48"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-28 h-9">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待确认</SelectItem>
                <SelectItem value="confirmed">已确认</SelectItem>
                <SelectItem value="assigned">已派单</SelectItem>
                <SelectItem value="in-service">服务中</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="cancelled">已取消</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue placeholder="全部服务" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部服务</SelectItem>
                {serviceTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />新建预约
          </Button>
        </div>

        {/* 预约列表 */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">预约编号</TableHead>
                <TableHead className="w-[120px]">客户信息</TableHead>
                <TableHead className="w-[100px]">服务类型</TableHead>
                <TableHead className="w-[120px]">预约时间</TableHead>
                <TableHead className="min-w-[150px]">服务地址</TableHead>
                <TableHead className="w-[80px]">状态</TableHead>
                <TableHead className="w-[80px]">派单人员</TableHead>
                <TableHead className="w-[80px]">来源</TableHead>
                <TableHead className="w-[100px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-mono text-xs">{apt.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{apt.customerName}</p>
                      <p className="text-xs text-muted-foreground">{apt.customerPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{apt.serviceType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{apt.preferredDate}</p>
                      <p className="text-xs text-muted-foreground">{apt.preferredTime}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{apt.address}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", statusConfig[apt.status].color)}>
                      {statusConfig[apt.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{apt.assignedStaff || "-"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{apt.source}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {(apt.status === "pending" || apt.status === "confirmed") && (
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleAssign(apt)}>
                          派单
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-xs"><Eye className="h-3 w-3 mr-2" />查看详情</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs"><Edit className="h-3 w-3 mr-2" />编辑</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs"><Phone className="h-3 w-3 mr-2" />联系客户</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs text-red-600"><XCircle className="h-3 w-3 mr-2" />取消预约</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* 新建预约对话框 */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>新建预约</DialogTitle>
              <DialogDescription>录入客户预约信息</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>客户姓名</Label>
                  <Input placeholder="请输入客户姓名" />
                </div>
                <div className="space-y-2">
                  <Label>联系电话</Label>
                  <Input placeholder="请输入联系电话" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>服务类型</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="选择服务类型" /></SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>预约来源</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="选择来源" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">线上预约</SelectItem>
                      <SelectItem value="phone">电话预约</SelectItem>
                      <SelectItem value="referral">转介绍</SelectItem>
                      <SelectItem value="old">老客户</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>期望日期</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>期望时段</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="选择时段" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">上午</SelectItem>
                      <SelectItem value="afternoon">下午</SelectItem>
                      <SelectItem value="day">白天</SelectItem>
                      <SelectItem value="fullday">全天</SelectItem>
                      <SelectItem value="livein">住家</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>服务地址</Label>
                <Input placeholder="请输入详细地址" />
              </div>
              <div className="space-y-2">
                <Label>备注说明</Label>
                <Textarea placeholder="客户特殊需求或备注" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>取消</Button>
              <Button onClick={() => setCreateDialogOpen(false)}>创建预约</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 派单对话框 */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>派单</DialogTitle>
              <DialogDescription>为预约 {selectedAppointment?.id} 分配服务人员</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">{selectedAppointment?.customerName}</p>
                <p className="text-xs text-muted-foreground">{selectedAppointment?.serviceType} | {selectedAppointment?.preferredDate}</p>
              </div>
              <div className="space-y-2">
                <Label>选择服务人员</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="选择服务人员" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff1">王阿姨 (金牌月嫂)</SelectItem>
                    <SelectItem value="staff2">李阿姨 (银牌月嫂)</SelectItem>
                    <SelectItem value="staff3">张阿姨 (育婴师)</SelectItem>
                    <SelectItem value="staff4">刘阿姨 (保姆)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>派单备注</Label>
                <Textarea placeholder="派单备注信息" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>取消</Button>
              <Button onClick={() => setAssignDialogOpen(false)}>确认派单</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
