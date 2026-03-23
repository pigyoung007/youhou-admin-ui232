"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  DollarSign,
  Download,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

// 科目报名记录接口
interface Enrollment {
  id: string
  studentId: string
  studentName: string
  studentPhone: string
  courseId: string
  courseName: string
  courseCategory: string // 课程分类：月嫂培训/育婴师培训/产康师培训等
  consultantId: string
  consultantName: string
  enrollDate: string
  price: number
  paidAmount: number
  paymentStatus: "unpaid" | "partial" | "paid"
  status: "active" | "completed" | "dropped" // 进行中/已完成/已退学
  classId: string // 班级ID
  className: string // 班级名称
  startDate: string
  endDate: string
  completedHours: number // 已完成课时
  totalHours: number // 总课时
  certificateStatus: "pending" | "applied" | "issued" // 证书状态
  notes: string
  source: string // 来源渠道
  createdAt: string
  updatedAt: string
}

// 模拟数据
const mockEnrollments: Enrollment[] = [
  {
    id: "ENR001",
    studentId: "STU001",
    studentName: "李小红",
    studentPhone: "138****1234",
    courseId: "CRS001",
    courseName: "金牌月嫂培训班",
    courseCategory: "月嫂培训",
    consultantId: "EMP001",
    consultantName: "张顾问",
    enrollDate: "2025-01-15",
    price: 3980,
    paidAmount: 3980,
    paymentStatus: "paid",
    status: "active",
    classId: "CLS001",
    className: "2025年1月金牌月嫂班",
    startDate: "2025-01-20",
    endDate: "2025-02-20",
    completedHours: 48,
    totalHours: 120,
    certificateStatus: "pending",
    notes: "学习认真，表现优秀",
    source: "转介绍",
    createdAt: "2025-01-15 10:30",
    updatedAt: "2025-01-23 16:00",
  },
  {
    id: "ENR002",
    studentId: "STU002",
    studentName: "王美华",
    studentPhone: "139****5678",
    courseId: "CRS002",
    courseName: "高级育婴师培训",
    courseCategory: "育婴师培训",
    consultantId: "EMP002",
    consultantName: "李顾问",
    enrollDate: "2025-01-18",
    price: 2980,
    paidAmount: 1500,
    paymentStatus: "partial",
    status: "active",
    classId: "CLS002",
    className: "2025年1月育婴师班",
    startDate: "2025-01-22",
    endDate: "2025-02-22",
    completedHours: 24,
    totalHours: 80,
    certificateStatus: "pending",
    notes: "",
    source: "自拓",
    createdAt: "2025-01-18 14:00",
    updatedAt: "2025-01-22 09:00",
  },
  {
    id: "ENR003",
    studentId: "STU003",
    studentName: "陈桂芳",
    studentPhone: "137****9012",
    courseId: "CRS003",
    courseName: "产康师认证培训",
    courseCategory: "产康师培训",
    consultantId: "EMP001",
    consultantName: "张顾问",
    enrollDate: "2025-01-10",
    price: 4580,
    paidAmount: 4580,
    paymentStatus: "paid",
    status: "completed",
    classId: "CLS003",
    className: "2025年1月产康师班",
    startDate: "2025-01-10",
    endDate: "2025-01-25",
    completedHours: 60,
    totalHours: 60,
    certificateStatus: "issued",
    notes: "已完成培训并取得证书",
    source: "线上",
    createdAt: "2025-01-10 09:00",
    updatedAt: "2025-01-25 17:00",
  },
  {
    id: "ENR004",
    studentId: "STU004",
    studentName: "赵小燕",
    studentPhone: "136****3456",
    courseId: "CRS001",
    courseName: "金牌月嫂培训班",
    courseCategory: "月嫂培训",
    consultantId: "EMP003",
    consultantName: "王顾问",
    enrollDate: "2025-01-20",
    price: 3980,
    paidAmount: 0,
    paymentStatus: "unpaid",
    status: "active",
    classId: "CLS001",
    className: "2025年1月金牌月嫂班",
    startDate: "2025-01-20",
    endDate: "2025-02-20",
    completedHours: 16,
    totalHours: 120,
    certificateStatus: "pending",
    notes: "待缴费",
    source: "转介绍",
    createdAt: "2025-01-20 11:00",
    updatedAt: "2025-01-23 10:00",
  },
  {
    id: "ENR005",
    studentId: "STU005",
    studentName: "孙美玲",
    studentPhone: "158****7890",
    courseId: "CRS004",
    courseName: "家政服务基础班",
    courseCategory: "家政培训",
    consultantId: "EMP002",
    consultantName: "李顾问",
    enrollDate: "2025-01-12",
    price: 1980,
    paidAmount: 1980,
    paymentStatus: "paid",
    status: "dropped",
    classId: "CLS004",
    className: "2025年1月家政基础班",
    startDate: "2025-01-15",
    endDate: "2025-02-15",
    completedHours: 20,
    totalHours: 60,
    certificateStatus: "pending",
    notes: "因个人原因退学，已退款",
    source: "线下",
    createdAt: "2025-01-12 15:30",
    updatedAt: "2025-01-22 14:00",
  },
]

// 统计数据
const statsData = {
  totalEnrollments: 28,
  activeEnrollments: 22,
  completedEnrollments: 5,
  totalRevenue: 89600,
}

// 顾问统计
const consultantStats = [
  { name: "张顾问", enrollments: 12, revenue: 42800, completionRate: 85 },
  { name: "李顾问", enrollments: 10, revenue: 32400, completionRate: 80 },
  { name: "王顾问", enrollments: 6, revenue: 14400, completionRate: 90 },
]

// 报名详情弹窗
function EnrollmentDetailDialog({ enrollment }: { enrollment: Enrollment }) {
  const progressPercent = Math.round((enrollment.completedHours / enrollment.totalHours) * 100)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <GraduationCap className="h-4 w-4 text-primary" />
            报名详情
            <Badge variant="outline" className={cn(
              "text-[10px] ml-2",
              enrollment.status === "completed" ? "bg-green-50 text-green-700" :
              enrollment.status === "active" ? "bg-blue-50 text-blue-700" :
              "bg-red-50 text-red-700"
            )}>
              {enrollment.status === "completed" ? "已完成" : enrollment.status === "active" ? "进行中" : "已退学"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* 学员信息 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                学员信息
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">学员姓名</p>
                  <p className="text-xs font-medium">{enrollment.studentName}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">联系电话</p>
                  <p className="text-xs font-medium">{enrollment.studentPhone}</p>
                </div>
              </div>
            </div>

            {/* 课程信息 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                课程信息
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">课程名称</p>
                  <p className="text-xs font-medium">{enrollment.courseName}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">课程分类</p>
                  <p className="text-xs font-medium">{enrollment.courseCategory}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">班级</p>
                  <p className="text-xs font-medium">{enrollment.className}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">跟进顾问</p>
                  <p className="text-xs font-medium">{enrollment.consultantName}</p>
                </div>
              </div>
            </div>

            {/* 学习进度 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                学习进度
              </h4>
              <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>已完成 {enrollment.completedHours}/{enrollment.totalHours} 课时</span>
                  <Badge variant="outline" className={cn(
                    "text-[10px]",
                    progressPercent >= 80 ? "bg-green-50 text-green-700" :
                    progressPercent >= 50 ? "bg-blue-50 text-blue-700" :
                    "bg-amber-50 text-amber-700"
                  )}>
                    {progressPercent}%
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      progressPercent >= 80 ? "bg-green-500" :
                      progressPercent >= 50 ? "bg-blue-500" :
                      "bg-amber-500"
                    )}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{enrollment.startDate} 开始</span>
                  <span>{enrollment.endDate} 结束</span>
                </div>
              </div>
            </div>

            {/* 费用信息 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                费用信息
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">课程价格</p>
                  <p className="text-xs font-bold text-primary">¥{enrollment.price.toLocaleString()}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">已支付</p>
                  <p className="text-xs font-medium text-emerald-600">¥{enrollment.paidAmount.toLocaleString()}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">待支付</p>
                  <p className={cn("text-xs font-medium", enrollment.price - enrollment.paidAmount > 0 ? "text-red-600" : "")}>
                    ¥{(enrollment.price - enrollment.paidAmount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* 证书状态 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium">证书状态</h4>
              <div className="p-2 rounded-lg bg-muted/30">
                <Badge variant="outline" className={cn(
                  "text-[10px]",
                  enrollment.certificateStatus === "issued" ? "bg-green-50 text-green-700" :
                  enrollment.certificateStatus === "applied" ? "bg-blue-50 text-blue-700" :
                  "bg-gray-50 text-gray-700"
                )}>
                  {enrollment.certificateStatus === "issued" ? "已颁发" : 
                   enrollment.certificateStatus === "applied" ? "申请中" : "待申请"}
                </Badge>
              </div>
            </div>

            {/* 其他信息 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium">其他信息</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">来源渠道</p>
                  <p className="text-xs font-medium">{enrollment.source}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground">报名日期</p>
                  <p className="text-xs font-medium">{enrollment.enrollDate}</p>
                </div>
              </div>
              {enrollment.notes && (
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-[10px] text-amber-600 mb-0.5">备注</p>
                  <p className="text-xs text-amber-800">{enrollment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0 bg-muted/30">
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs bg-transparent">
              <Edit className="h-3 w-3 mr-1" />
              编辑
            </Button>
            {enrollment.status === "active" && enrollment.certificateStatus === "pending" && (
              <Button size="sm" className="flex-1 h-7 text-xs">
                申请证书
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 新建报名弹窗
function CreateEnrollmentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          新增报名
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4 text-primary" />
            新增科目报名
          </DialogTitle>
          <DialogDescription className="text-xs">
            为学员添加新的培训科目报名记录
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* 学员选择 */}
            <div className="space-y-1.5">
              <Label className="text-xs">选择学员</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="请选择学员" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">李小红 - 138****1234</SelectItem>
                  <SelectItem value="2">王美华 - 139****5678</SelectItem>
                  <SelectItem value="3">陈桂芳 - 137****9012</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 课程选择 */}
            <div className="space-y-1.5">
              <Label className="text-xs">选择课程</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="请选择课程" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">金牌月嫂培训班 - ¥3,980</SelectItem>
                  <SelectItem value="2">高级育婴师培训 - ¥2,980</SelectItem>
                  <SelectItem value="3">产康师认证培训 - ¥4,580</SelectItem>
                  <SelectItem value="4">家政服务基础班 - ¥1,980</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 班级选择 */}
            <div className="space-y-1.5">
              <Label className="text-xs">选择班级</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="请选择班级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">2025年1月金牌月嫂班 (01-20 ~ 02-20)</SelectItem>
                  <SelectItem value="2">2025年2月金牌月嫂班 (02-15 ~ 03-15)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 跟进顾问 */}
            <div className="space-y-1.5">
              <Label className="text-xs">跟进顾问</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="请选择顾问" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">张顾问</SelectItem>
                  <SelectItem value="2">李顾问</SelectItem>
                  <SelectItem value="3">王顾问</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 来源渠道 */}
            <div className="space-y-1.5">
              <Label className="text-xs">来源渠道</Label>
              <Select>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="请选择来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="referral">转介绍</SelectItem>
                  <SelectItem value="self">自拓</SelectItem>
                  <SelectItem value="online">线上</SelectItem>
                  <SelectItem value="offline">线下</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 费用信息 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">课程价格</Label>
                <Input type="number" placeholder="0" className="h-8 text-xs" defaultValue="3980" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">已支付金额</Label>
                <Input type="number" placeholder="0" className="h-8 text-xs" />
              </div>
            </div>

            {/* 备注 */}
            <div className="space-y-1.5">
              <Label className="text-xs">备注</Label>
              <Textarea placeholder="请填写备注信息..." className="text-xs min-h-16 resize-none" />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-4 py-2.5 border-t shrink-0">
          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">取消</Button>
          <Button size="sm" className="h-7 text-xs">确认报名</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function EnrollmentsPage() {
  const [currentTab, setCurrentTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const statusConfig = {
    active: { label: "进行中", className: "bg-blue-50 text-blue-700 border-blue-200" },
    completed: { label: "已完成", className: "bg-green-50 text-green-700 border-green-200" },
    dropped: { label: "已退学", className: "bg-red-50 text-red-700 border-red-200" },
  }

  const paymentStatusConfig = {
    unpaid: { label: "未支付", className: "bg-red-50 text-red-700" },
    partial: { label: "部分付", className: "bg-amber-50 text-amber-700" },
    paid: { label: "已付清", className: "bg-green-50 text-green-700" },
  }

  const filteredEnrollments = mockEnrollments.filter(enrollment => {
    if (currentTab === "active") return enrollment.status === "active"
    if (currentTab === "completed") return enrollment.status === "completed"
    return true
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">科目报名记录</h1>
            <p className="text-muted-foreground mt-1">管理学员培训科目报名与学习进度</p>
          </div>
          <CreateEnrollmentDialog />
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <GraduationCap className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">{statsData.totalEnrollments}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">总报名数</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 flex-shrink-0">
                  <BookOpen className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">{statsData.activeEnrollments}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">进行中</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-600 flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">{statsData.completedEnrollments}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">已完成</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 flex-shrink-0">
                  <DollarSign className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg lg:text-2xl font-bold truncate">¥{(statsData.totalRevenue / 10000).toFixed(1)}万</p>
                  <p className="text-xs lg:text-sm text-muted-foreground truncate">总收入</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 顾问统计 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              顾问报名统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">顾问</TableHead>
                    <TableHead className="text-xs text-center">报名数</TableHead>
                    <TableHead className="text-xs text-center">收入</TableHead>
                    <TableHead className="text-xs text-center">完课率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultantStats.map((stat) => (
                    <TableRow key={stat.name}>
                      <TableCell className="text-xs font-medium">{stat.name}</TableCell>
                      <TableCell className="text-xs text-center">{stat.enrollments}</TableCell>
                      <TableCell className="text-xs text-center font-medium text-emerald-600">
                        ¥{stat.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge variant="outline" className={cn(
                          "text-[10px]",
                          stat.completionRate >= 85 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                        )}>
                          {stat.completionRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 筛选和标签 */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="all" className="text-xs">全部报名</TabsTrigger>
              <TabsTrigger value="active" className="text-xs">进行中</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs">已完成</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索学员/课程..." className="pl-9 h-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-36 h-9">
                <SelectValue placeholder="课程分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="nanny">月嫂培训</SelectItem>
                <SelectItem value="infant">育婴师培训</SelectItem>
                <SelectItem value="postpartum">产康师培训</SelectItem>
                <SelectItem value="housekeeping">家政培训</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-32 h-9">
                <SelectValue placeholder="顾问" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部顾问</SelectItem>
                <SelectItem value="zhang">张顾问</SelectItem>
                <SelectItem value="li">李顾问</SelectItem>
                <SelectItem value="wang">王顾问</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9 bg-transparent">
              <Download className="h-4 w-4 mr-1.5" />
              导出
            </Button>
          </div>
        </div>

        {/* 报名列表 */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">学员</TableHead>
                    <TableHead className="text-xs">课程</TableHead>
                    <TableHead className="text-xs">班级</TableHead>
                    <TableHead className="text-xs">顾问</TableHead>
                    <TableHead className="text-xs">报名日期</TableHead>
                    <TableHead className="text-xs text-center">进度</TableHead>
                    <TableHead className="text-xs text-right">价格</TableHead>
                    <TableHead className="text-xs text-center">付款</TableHead>
                    <TableHead className="text-xs text-center">状态</TableHead>
                    <TableHead className="text-xs text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnrollments.map((enrollment) => {
                    const progressPercent = Math.round((enrollment.completedHours / enrollment.totalHours) * 100)
                    return (
                      <TableRow key={enrollment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                {enrollment.studentName.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs font-medium">{enrollment.studentName}</p>
                              <p className="text-[10px] text-muted-foreground">{enrollment.studentPhone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-xs font-medium">{enrollment.courseName}</p>
                            <p className="text-[10px] text-muted-foreground">{enrollment.courseCategory}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{enrollment.className}</TableCell>
                        <TableCell className="text-xs">{enrollment.consultantName}</TableCell>
                        <TableCell className="text-xs">{enrollment.enrollDate}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  progressPercent >= 80 ? "bg-green-500" :
                                  progressPercent >= 50 ? "bg-blue-500" :
                                  "bg-amber-500"
                                )}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground">{progressPercent}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-right font-medium">
                          ¥{enrollment.price.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={cn("text-[10px]", paymentStatusConfig[enrollment.paymentStatus].className)}>
                            {paymentStatusConfig[enrollment.paymentStatus].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={cn("text-[10px]", statusConfig[enrollment.status].className)}>
                            {statusConfig[enrollment.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <EnrollmentDetailDialog enrollment={enrollment} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 分页 */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 <span className="font-medium text-foreground">{filteredEnrollments.length}</span> 条记录
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8">1</Button>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
